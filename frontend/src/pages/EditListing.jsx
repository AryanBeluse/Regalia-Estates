import React, { useState, useRef } from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify'
import { useEffect } from 'react';


const EditListing = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const { currentUser, token } = useSelector((state) => (state.user))
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()
    const fileInputRef = useRef(null);
    const [images, setImages] = useState([])
    const [formData, setFormData] = useState({
        LisName: "",
        description: "",
        address: {
            propertyName: "",
            city: "",
            state: "",
            country: "",
        },
        features: {
            sell: true,
            rent: false,
            parking: false,
            furnished: false,
            offer: true,
        },
        regularPrice: 0,
        discountPrice: 0,
        bathrooms: 0,
        bedrooms: 0,
        type: "",
        status: "available",
        size: {
            value: 1,
            unit: "sqft",
        },
        imageUrls: [],
        userRef: currentUser._id,
    });

    useEffect(() => {
        const fetchListing = async () => {
            if (!params.listingId) return;

            try {
                const { data } = await axios.get(`${backendUrl}/api/listing/get/${params.listingId}`);
                if (data.success) {
                    setFormData(data.listingData);
                    setImages(data.listingData.imageUrls)
                }
            } catch (error) {
                console.log("fetching error", error);
            }
        };

        fetchListing();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;

        setFormData((prevData) => {
            const keys = id.split(".");
            if (keys.length === 2) {
                const [parent, child] = keys;
                return {
                    ...prevData,
                    [parent]: {
                        ...prevData[parent],
                        [child]: value
                    }
                };
            }

            return { ...prevData, [id]: value };
        });
    };

    const handleFeatureChange = (e) => {
        const { id, checked } = e.target;
        const featureKey = id.replace("features-", ""); // Extract feature name

        setFormData((prevData) => {
            if (featureKey === "sell" && checked) {
                return {
                    ...prevData,
                    features: { ...prevData.features, sell: true, rent: false }
                };
            } else if (featureKey === "rent" && checked) {
                return {
                    ...prevData,
                    features: { ...prevData.features, rent: true, sell: false }
                };
            } else {
                return {
                    ...prevData,
                    features: { ...prevData.features, [featureKey]: checked }
                };
            }
        });
    };


    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        setFormData((prevData) => ({
            ...prevData,
            imageUrls: [...prevData.imageUrls, ...files],
        }));

        const urls = files.map((file) => URL.createObjectURL(file));
        setImages((prevImages) => [...prevImages, ...urls]);

        fileInputRef.current.value = '';
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
        setFormData((prev) => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((_, i) => i !== index),
        }))
    }


    // console.log(formData);
    // console.log(images, "images");




    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !formData.LisName ||
            !formData.description ||
            !formData.type ||
            !formData.address.propertyName ||
            !formData.address.city ||
            !formData.address.state ||
            !formData.address.country ||
            !formData.size?.value ||
            formData.size.value <= 0
        ) {
            alert("Please fill all required fields.");
            return;
        }

        const updatedFormData = new FormData();

        Object.keys(formData).forEach((key) => {
            if (["address", "size", "features"].includes(key)) {
                updatedFormData.append(key, JSON.stringify(formData[key]));
            } else if (key === "imageUrls") {
                formData.imageUrls.forEach((url) => {
                    updatedFormData.append('imageUrl', url);
                })
            }
            else if (key === "userRef") {
                updatedFormData.append(key, formData.userRef._id)
            } else {
                updatedFormData.append(key, formData[key]);
            }
        });

        // console.log("updatedFormData", updatedFormData);


        try {
            const { data } = await axios.post(`${backendUrl}/api/listing/edit/${params.listingId}`, updatedFormData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (data.success) {
                toast.success("Listing updated successfully!");
                navigate("/profile");
            }
        } catch (error) {
            toast.error("Error updating listing.");
            console.log(error.response?.data?.message);

        }
    };




    if (!currentUser.isBroker) return (
        <div>
            <h2 className='font-semibold text-2xl text-center mt-10 text-red-600'>Verified Broker Account required!</h2>
        </div>
    );

    if (currentUser.isBroker) return (
        <main className=" min-h-screen py-10">
            <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-2xl">
                <h1 className="text-3xl font-semibold text-gray-800 mb-9 text-center">
                    Edit Listing
                </h1>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {/* Left Section */}
                    <div className="space-y-6 mt-1">
                        {/* Name & Description */}
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Name"
                                id="LisName"
                                maxLength={62}
                                minLength={2}
                                required
                                className="input-field"
                                value={formData.LisName}
                                onChange={(e) => { handleChange(e) }}
                            />
                            <textarea
                                placeholder="Description"
                                id="description"
                                required
                                rows="2"
                                className="input-field resize-none"
                                value={formData.description}
                                onChange={(e) => { handleChange(e) }}
                            ></textarea>
                        </div>

                        {/* Address */}
                        <div className="bg-gray-100 p-4 rounded-lg shadow-sm border">
                            <h2 className="text-lg font-semibold text-gray-700 mb-3">Address Details</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {["propertyName", "city", "state", "country"].map((field) => (
                                    <input
                                        key={field}
                                        type="text"
                                        placeholder={(field === 'propertyName') ? ("name") : field}
                                        id={`address.${field}`}
                                        required
                                        className="input-field"
                                        value={formData.address[field] || ""}
                                        onChange={handleChange}
                                    />
                                ))}
                            </div>
                        </div>

                        {/*Property type*/}
                        <div>
                            <label className=" text-gray-700 font-semibold">Property Type</label>
                            <select
                                className="border p-2  rounded-md w-full"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="">Select Type</option>
                                <option value="apartment">Apartment</option>
                                <option value="house">House</option>
                                <option value="villa">Villa</option>
                                <option value="commercial">Commercial</option>
                                <option value="land">Land</option>
                            </select>
                        </div>


                        {/* Beds & Baths */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-gray-700 font-medium">Beds</label>
                                <input type="number" id="bedrooms" min="1" required className="input-field"
                                    value={formData.bedrooms}
                                    onChange={handleChange} />
                            </div>
                            <div>
                                <label className="text-gray-700 font-medium">Baths</label>
                                <input type="number" id="bathrooms" min="1" required className="input-field"
                                    value={formData.bathrooms}
                                    onChange={handleChange} />
                            </div>
                        </div>

                        {/* Pricing & Details */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-gray-700 font-medium">Regular Price </label>
                                {formData.features.rent &&
                                    <p className='text-xs font-semibold text-gray-700'>(₹ / Month)</p>}
                                <input type="number" min="1" id="regularPrice" required className="input-field"
                                    value={formData.regularPrice}
                                    onChange={handleChange} />
                            </div>
                            {formData.features.offer && <div>
                                <label className="text-gray-700 font-medium">Discounted Price</label>
                                {formData.features.rent &&
                                    <p className='text-xs font-semibold text-gray-700'>(₹ / Month)</p>}
                                <input type="number" min="1" id="discountPrice" required className="input-field"
                                    value={formData.discountPrice}
                                    onChange={handleChange} />
                            </div>}
                        </div>



                    </div>




                    {/* Right Section */}
                    <div className="space-y-6 mt-1">

                        {/* Size */}
                        <div className="flex items-center space-x-4">
                            <label htmlFor="size.value" className="text-gray-700 pl-1 font-medium">
                                Size
                            </label>
                            <input
                                type="number"
                                id="size.value"
                                placeholder="Size"
                                min="1"
                                required
                                className="input-field w-20"
                                value={formData.size.value || ""}
                                onChange={handleChange}
                            />
                            <select
                                id="size.unit"
                                className="input-field w-24"
                                value={formData.size.unit || ""}
                                onChange={handleChange}
                            >
                                <option value="sqft">sqft</option>
                                <option value="acres">acres</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label htmlFor="status" className="text-gray-700 font-medium">
                                Current Status
                            </label>
                            <select id="status" className="input-field w-32" value={formData.status}
                                onChange={(e) => { handleChange(e) }}>
                                <option value="available">Available</option>
                                <option value="rented">Rented</option>
                            </select>
                        </div>

                        {/* Features */}
                        <div className="bg-gray-100 border p-4 rounded-lg shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-700 mb-3">Features</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {["sell", "rent", "parking", "furnished", "offer"].map((label) => (
                                    <label key={label} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="accent-green-600"
                                            id={`features-${label}`}
                                            checked={formData.features[label] || false}
                                            onChange={handleFeatureChange}
                                        />
                                        <span className="text-gray-700 capitalize">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <hr />

                        {/* Image Upload */}
                        <div className="bg-gray-100 border p-7 rounded-lg shadow-sm">
                            <p className="text-gray-700 font-medium">
                                Images: <span className="pl-1 text-sm text-gray-500">First image will be the cover (max 4),</span>

                            </p>
                            <span className="pl-16 font-medium text-sm text-gray-500">Please, select all image at once.</span>
                            <div className="flex items-center space-x-4 mt-2">
                                <input
                                    type="file"
                                    id="imageUrls"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleImageChange}
                                    ref={fileInputRef}
                                />
                                {formData.imageUrls.length < 4 && <label
                                    htmlFor="imageUrls"
                                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg cursor-pointer hover:bg-green-700 transition"
                                >
                                    Choose Files
                                </label>}
                            </div>
                            <div className='grid grid-cols-2 md:grid-cols-2 gap-4 mt-4'>
                                {images && images.map((image, index) => (
                                    <div key={index} className='relative'>
                                        <button
                                            type="button"
                                            className='absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center'
                                            onClick={() => { removeImage(index) }}
                                        >
                                            X
                                        </button>
                                        <img
                                            className='w-full h-24 object-cover rounded-lg border'
                                            src={image}
                                            alt={`Uploaded ${index}`}
                                        />
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* Submit Button */}
                        <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:opacity-80 transition" onClick={handleSubmit}>
                            Edit Listing
                        </button>

                    </div>

                </form>
            </div>
        </main>
    );
};

export default EditListing
