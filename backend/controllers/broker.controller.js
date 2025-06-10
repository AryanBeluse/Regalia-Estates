import Preferences from "../models/preferences.model.js";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import Saved from "../models/saved.model.js";

const getAllPreferences = async (req, res, next) => {
    try {
        const preferences = await Preferences.find()
            .populate("user", "username email phone avatar");

        res.status(200).json({
            success: true,
            message: "Fetched all preferences with user info",
            preferences,
        });
    } catch (error) {
        console.error("Error fetching all preferences:", error);
        next(error(500, "Internal Server Error"));
    }
};

const UsersInterestedInBrokerListings = async (req, res) => {
    try {
        const { brokerId } = req.params;

        // Step 1: Get all listings posted by the broker
        const brokerListings = await Listing.find({ userRef: brokerId }, '_id');
        const brokerListingIds = brokerListings.map(listing => listing._id);

        // Step 2: Find all Saved entries where those listings are saved
        const savedEntries = await Saved.find({
            listings: { $in: brokerListingIds }
        }).populate('userRef', 'username email phone avatar');

        // Step 3: Extract and populate matched listings manually
        const filtered = [];

        for (const entry of savedEntries) {
            const matchedIds = entry.listings.filter(id =>
                brokerListingIds.some(bid => bid.equals(id))
            );

            const matchedListings = await Listing.find(
                { _id: { $in: matchedIds } },
                'LisName imageUrls' // only get name and image
            );

            // Format the listings with just first image
            const formattedListings = matchedListings.map(listing => ({
                _id: listing._id,
                LisName: listing.LisName,
                image: listing.imageUrls?.[0] || '',
            }));

            filtered.push({
                user: entry.userRef,
                matchedListings: formattedListings
            });
        }

        return res.status(200).json({
            success: true,
            data: filtered
        });

    } catch (error) {
        console.error("Error finding users who saved broker's listings:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};




export {
    getAllPreferences,
    UsersInterestedInBrokerListings
}
