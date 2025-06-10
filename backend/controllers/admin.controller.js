import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";


const getAllListings = async (req, res) => {
    try {
        const listings = await Listing.find({}).populate("userRef", ["username", "avatar", "email"])
        return res.json({ success: true, listings })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password")
        return res.json({ success: true, users })

    } catch (error) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

const handleVerified = async (req, res) => {
    try {
        const { id } = req.params
        const listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        listing.verified = !listing.verified;
        await listing.save();

        return res.status(200).json({ success: true, message: 'Verified status updated' });
    } catch (error) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        await Listing.updateMany(
            { userRef: userId },
            { $unset: { userRef: "" } }
        )
        await User.findByIdAndDelete(userId)
        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

const deleteListing = async (req, res) => {
    try {
        const listingId = req.params.id
        await Listing.findByIdAndDelete(listingId)
        return res.status(200).json({
            success: true,
            message: "Listing deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

export {
    getAllListings,
    getAllUsers,
    handleVerified,
    deleteUser,
    deleteListing

}

