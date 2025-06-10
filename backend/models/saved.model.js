import mongoose from "mongoose";

const savedSchema = new mongoose.Schema(
    {
        listings: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing",
            required: true
        }],
        userRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

const Saved = mongoose.model('Saved', savedSchema);

export default Saved;