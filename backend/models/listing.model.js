import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    propertyName: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true }
});

const featuresSchema = new mongoose.Schema({
    sell: { type: Boolean, required: true, default: true },
    rent: { type: Boolean, required: true, default: false },
    parking: { type: Boolean, required: true, default: false },
    furnished: { type: Boolean, required: true, default: false },
    offer: { type: Boolean, required: true, default: false },
})

const listingSchema = new mongoose.Schema(
    {
        LisName: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        address: {
            type: addressSchema,
            required: true,
        },
        features: {
            type: featuresSchema,
            required: true,
        },
        regularPrice: {
            type: Number,
            required: true,
        },
        discountPrice: {
            type: Number,
        },
        bathrooms: {
            type: Number,
            required: true,
            min: 0
        },
        bedrooms: {
            type: Number,
            required: true,
            min: 0
        },
        type: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["available", "sold", "rented", "pending"],
            default: "available"
        },
        size: {
            value: { type: Number, required: true, min: 1 },
            unit: { type: String, enum: ["sqft", "acres"], default: "sqft" }
        },
        imageUrls: {
            type: Array,
            required: true,
        },
        userRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        verified: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
