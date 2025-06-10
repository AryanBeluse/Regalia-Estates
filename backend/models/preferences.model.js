import mongoose from "mongoose";

const preferencesSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        listingType: {
            type: [{ type: String, enum: ['sell', 'rent'] }],
            default: ['rent']
        },
        furnished: {
            type: Boolean,
            default: false,
        },
        parking: {
            type: Boolean,
            default: false,
        },
        offerOnly: {
            type: Boolean,
            default: false,
        },
        minPrice: {
            type: Number,
            default: 0,
        },
        maxPrice: {
            type: Number,
            default: 100000000,
        },
        bedrooms: {
            type: Number,
            default: 0,
        },
        bathrooms: {
            type: Number,
            default: 0,
        },
        propertyTypes: {
            type: [String],
            default: [],
        },
        preferredCities: {
            type: [String],
            default: [],
        },
        minSize: {
            type: Number,
            default: 0,
        },
        maxSize: {
            type: Number,
            default: 100000000,
        },
        unit: {
            type: String,
            enum: ['sqft', 'acres'],
            default: 'sqft',
        },
    }, { timestamps: true });

const Preferences = mongoose.model('Preferences', preferencesSchema);

export default Preferences;