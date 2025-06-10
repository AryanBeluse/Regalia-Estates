import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import Saved from "../models/saved.model.js";
import { error } from "../utils/errorHandler.js";
import { v2 as cloudinary } from "cloudinary"
import Preferences from "../models/preferences.model.js";


const updateUser = async (req, res, next) => {
    try {

        if (!req.user || req.user.id !== req.params.id) {
            console.error("Unauthorized user");
            return next(error(401, "Unauthorized user"));
        }

        let updateFields = {
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone
        };

        if (req.file) {
            try {
                const imageUpload = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' });
                updateFields.avatar = imageUpload.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                return next(error(500, "Image upload failed"));
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true }
        );

        if (!updatedUser) {
            return next(error(404, "User not found"));
        }

        const { password, ...rest } = updatedUser._doc;
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: rest
        });

    } catch (err) {
        console.error("Server Error:", err);
        next(error(500, "Internal Server Error"));
    }
};

const saveListing = async (req, res) => {
    try {
        const { userId, listingId } = req.body

        let savedListing = await Saved.findOne({ userRef: userId });

        if (savedListing) {
            if (!savedListing.listings.includes(listingId)) {
                savedListing.listings.push(listingId);
                await savedListing.save();
            } else {
                return res.status(400).json({
                    success: false,
                    message: "This listing is already saved by the user.",
                });
            }
        } else {
            savedListing = new Saved({
                userRef: userId,
                listings: [listingId],
            });
            await savedListing.save();
        }
        return res.status(200).json({
            success: true,
        })
    } catch (err) {
        console.error("Server Error:", err);
        next(error(500, "Internal Server Error"))
    }
}

const getSavedListings = async (req, res) => {
    try {
        const userId = req.params.id

        const savedUserListings = await Saved.find({ userRef: userId })
            .populate("userRef", ["avatar", "email", "username"])
            .populate("listings")

        if (!savedUserListings) {
            return res.status(404).json({ message: "No saved listings found for this user" });
        }

        return res.status(200).json({
            success: true,
            savedUserListings
        })

    } catch (error) {
        console.error("Server Error:", error);
    }
}

const savePreferences = async (req, res, next) => {
    try {

        const preferences = req.body;
        console.log("re", req.body);


        const existing = await Preferences.findOne({ user: preferences.user });
        if (existing) {
            const updated = await Preferences.findOneAndUpdate(
                { user: preferences.user },
                preferences,
                { new: true }
            );
            return res.status(200).json({
                success: true,
                message: "Preferences updated successfully",
                preferences: updated,
            });
        } else {
            const newPreferences = new Preferences(preferences);
            await newPreferences.save();
            return res.status(200).json({
                success: true,
                message: "Preferences saved successfully",
                preferences: newPreferences,
            });
        }
    } catch (err) {
        console.error("Server Error:", err);
        next(error(500, "Internal Server Error"));
    }
};

const getPreferences = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        console.log("hhe", req);

        const preferences = await Preferences.findOne({ user: userId });

        if (!preferences) {
            return res.status(404).json({
                success: false,
                message: "Preferences not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Preferences fetched successfully",
            preferences,
        });
    } catch (err) {
        console.error("Server Error:", err);
        next(error(500, "Internal Server Error"));
    }
};



export {
    updateUser,
    saveListing,
    getSavedListings,
    savePreferences,
    getPreferences
}