import Listing from "../models/listing.model.js";
import { error } from "../utils/errorHandler.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

const safeParseJSON = (data) => {
    try {
        return typeof data === "string" ? JSON.parse(data) : data;
    } catch (err) {
        console.error("JSON Parse Error:", err);
        return data;
    }
};

const createListing = async (req, res, next) => {
    try {

        let listingData = { ...req.body };
        // console.log("Request body:", listingData);

        listingData.imageUrls = Array.isArray(listingData.imageUrls) ? listingData.imageUrls : [];

        const { LisName, description, address, features, size, ...rest } = listingData;

        const parsedAddress = safeParseJSON(address);
        const parsedFeatures = safeParseJSON(features);
        const parsedSize = safeParseJSON(size);

        if (!parsedFeatures) {
            return res.status(400).json({ error: "Invalid features format" });
        }

        if (req.files && req.files.length > 0) {
            try {
                const uploadedImageUrls = await Promise.all(
                    req.files.map(async (file) => {
                        const uploadResult = await cloudinary.uploader.upload(file.path, { resource_type: 'image' });
                        return uploadResult.secure_url;
                    })
                );
                listingData.imageUrls = [...listingData.imageUrls, ...uploadedImageUrls];
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                return next(error(500, "Image upload failed"));
            }
        }

        const newListing = new Listing({
            LisName,
            description,
            address: parsedAddress,
            features: parsedFeatures,
            size: parsedSize,
            ...rest,
            imageUrls: listingData.imageUrls,
        });

        await newListing.save();
        return res.status(200).json({
            success: true,
            message: "Listing created successfully",
            newListing,
        });
    } catch (err) {
        console.error("Server Error:", err);
        next(error(500, "Internal Server Error"));
    }
};

const editListings = async (req, res, next) => {
    try {
        const listingData = await Listing.findById(req.params.id);
        if (!listingData) return next(error(404, "No Listings found"));

        // Get updated values from req.body (not from DB)
        const { LisName, description, address, features, size, imageUrl, ...rest } = req.body;
        // console.log("Request", req.body);


        // Parse complex objects sent as JSON strings
        const parsedAddress = safeParseJSON(address);
        const parsedFeatures = safeParseJSON(features);
        const parsedSize = safeParseJSON(size);

        if (!parsedFeatures || !parsedAddress || !parsedSize) {
            return res.status(400).json({ error: "Invalid format in address, features, or size." });
        }


        let newImageUrls = [];

        if (imageUrl) {
            if (Array.isArray(imageUrl)) {
                newImageUrls = [...imageUrl];
            } else {
                newImageUrls.push(imageUrl);
            }
        }

        if (req.files && req.files.length > 0) {
            try {
                const uploadedImageUrls = await Promise.all(
                    req.files.map(async (file) => {
                        const uploadResult = await cloudinary.uploader.upload(file.path, { resource_type: 'image' });
                        return uploadResult.secure_url;
                    })
                );
                newImageUrls = [...newImageUrls, ...uploadedImageUrls];
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                return next(error(500, "Image upload failed"));
            }
        }

        const updated = await Listing.findByIdAndUpdate(
            req.params.id,
            {
                LisName,
                description,
                address: parsedAddress,
                features: parsedFeatures,
                size: parsedSize,
                ...rest,
                imageUrls: newImageUrls,
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            updatedListing: updated,
            message: "Listing updated successfully",
        });
    } catch (err) {
        next(err);
    }
}




const getUserListings = async (req, res, next) => {
    try {
        const { id: userId } = req.params


        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return next(error(400, "Invalid User ID format"));
        }

        if (!userId) return next(error(400, "User ID is required"))
        const userListings = await Listing.find({ userRef: new mongoose.Types.ObjectId(userId) })
        if (!userListings.length) return next(error(404, "No Listings found"))
        return res.status(200).json({
            success: true,
            userListings
        })
    } catch (err) {
        console.error(err);
        next(err);
    }
}


const deleteListings = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(error(404, "No Listings found"));
        }

        if (req.user.id !== listing.userRef.toString()) {
            return next(error(401, "You can only delete your own listings!"));
        }
        await Listing.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: "Listing has been deleted!" });

    } catch (err) {
        next(err);
    }
};

const getListings = async (req, res, next) => {
    try {

        const listingData = await Listing.findById(req.params.id).populate("userRef", ["avatar", "email", "username"])
        if (!listingData) {
            return next(error(404, "No Listings found"));
        }
        res.status(200).json({
            success: true,
            listingData,
        })

    } catch (err) {
        next(err);
    }
}

const getSearchResults = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        const {
            searchTerm = '',
            type = 'all',
            parking = 'false',
            furnished = 'false',
            offer = 'false',
            verified = 'false',
            sort = 'createdAt',
            order = 'desc',
            propertyType = [],
        } = req.query;

        const parseBoolean = (val) => val === 'true';

        const query = {
            LisName: { $regex: searchTerm, $options: 'i' },
        };

        if (parseBoolean(parking)) query['features.parking'] = true;
        if (parseBoolean(furnished)) query['features.furnished'] = true;
        if (parseBoolean(offer)) query['features.offer'] = true;
        if (parseBoolean(verified)) query['verified'] = true;

        if (type === 'rent') query['features.rent'] = true;
        else if (type === 'sale') query['features.sell'] = true;

        if (propertyType && propertyType.length > 0) {
            const typesArray = Array.isArray(propertyType) ? propertyType : [propertyType];
            query['type'] = { $in: typesArray.map(type => type.toLowerCase()) }
        }

        const listings = await Listing.find(query)
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip(startIndex)
            .limit(limit);

        return res.status(200).json({ success: true, listings });
    } catch (err) {
        next(err);
    }
};




export {
    createListing,
    getUserListings,
    deleteListings,
    editListings,
    getListings,
    getSearchResults
};
