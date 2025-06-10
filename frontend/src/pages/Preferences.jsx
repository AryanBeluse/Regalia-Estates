import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Preferences = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const { currentUser, token } = useSelector((state) => state.user)
    const navigate = useNavigate()
    const [cityInput, setCityInput] = useState("");
    const [preferences, setPreferences] = useState({
        user: currentUser._id,
        listingType: [],
        propertyTypes: [],
        preferredCities: [],
        minSize: 0,
        maxSize: 0,
        minPrice: 0,
        maxPrice: 0,
        unit: "sqft",
        offerOnly: false,
        furnished: false,
        parking: false,
        bedrooms: 0,
        bathrooms: 0
    })

    const removeCity = (index) => {
        const updated = [...preferences.preferredCities]
        updated.splice(index, 1)
        setPreferences(prev => ({
            ...prev,
            preferredCities: updated
        }))
    }

    const removeType = (index, id) => {
        const updated = [...preferences[id]];
        updated.splice(index, 1);
        setPreferences(prev => ({
            ...prev,
            [id]: updated
        }));
    };


    const handleChange = (e) => {
        const { id, type, value, checked } = e.target
        setPreferences((prev) => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }))
    }

    const handleChangeArray = (e) => {
        const { id, value } = e.target;
        setPreferences((prev) => {
            const currentArray = Array.isArray(prev[id]) ? prev[id] : [];
            const alreadyExists = currentArray.includes(value);

            return {
                ...prev,
                [id]: alreadyExists
                    ? currentArray.filter((item) => item !== value)
                    : [...currentArray, value],
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (preferences.preferredCities.length > 3) {
            alert("Maximum of 3 cities allowed")
            return
        }


        try {
            const { data } = await axios.post(`${backendUrl}/api/user/save-preferences`, preferences, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (data.success) {
                toast.success("Preferences updated successfully!")
            }
        } catch (error) {
            toast.error("Error updating preferences.");
            console.log(error.response?.data?.message);
        }
    }

    useEffect(() => {
        const fetchListing = async () => {
            if (!currentUser._id) return;

            try {
                const { data } = await axios.get(`${backendUrl}/api/user/get-preferences/${currentUser._id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (data.success) {
                    setPreferences(data.preferences);
                }
            } catch (error) {
                console.log("fetching error", error);
            }
        };
        fetchListing();
    }, [currentUser._id]);

    console.log(preferences);


    return (
        <div className=" mx-auto   bg-white ">
            <div className="mb-10">

                <p className="text-gray-600 mt-2">
                    Help us refine your experience by setting your property preferences. This ensures tailored listings and smarter recommendations.
                </p>
            </div>

            <form
                className="space-y-10"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        const tag = e.target.tagName.toLowerCase();
                        if (tag === 'input' && e.target.type !== 'submit') {
                            e.preventDefault();
                        }
                    }
                }}
                onSubmit={handleSubmit}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Location & Property Type */}
                    <div className="bg-gray-50 p-6 bord rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold  mb-4">Locations & Property Type</h2>
                        <div className="space-y-4">
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-1">Location (max 3)</label>
                                <div className="flex flex-row gap-2">
                                    <input
                                        type="text"
                                        value={cityInput}
                                        placeholder="e.g. Mumbai"
                                        onChange={(e) => setCityInput(e.target.value)}
                                        className="w-1/2 border border-gray-300 rounded-md p-2"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const city = cityInput.trim();
                                            if (
                                                city &&
                                                !preferences.preferredCities.includes(city) &&
                                                preferences.preferredCities.length < 3
                                            ) {
                                                setPreferences((prev) => ({
                                                    ...prev,
                                                    preferredCities: [...prev.preferredCities, city],
                                                }));
                                                setCityInput("");
                                            }
                                        }}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                    >
                                        Add
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-2">
                                    {preferences.preferredCities.map((city, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-50 border border-blue-300 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-2"
                                        >
                                            <span className="text-sm">{city}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeCity(index)}
                                                className="text-blue-500 hover:text-red-600 font-bold text-xs"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium  mb-1">Buy or Rent a Property</label>
                                <div className='flex flex-col gap-2'>
                                    <select
                                        onChange={(e) => handleChangeArray(e)}
                                        id="listingType"
                                        className="w-1/2 border border-gray-300 rounded-md p-2">
                                        <option value="" disabled selected>Select type</option>
                                        <option value="sell">Buy</option>
                                        <option value="rent">Rent</option>
                                    </select>
                                    <div className="flex flex-wrap gap-2 mt-1 ">
                                        {preferences.listingType.map((type, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-50 border border-blue-300 text-blue-700 px-2 py-0.5 rounded-full  flex items-center gap-2"
                                            >
                                                <span className="text-sm">{type}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeType(index, "listingType")}
                                                    className="text-blue-500 hover:text-red-600 font-bold text-xs"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium  mb-1">Property Type</label>
                                <div className='flex flex-col gap-2'>
                                    <select
                                        onChange={(e) => handleChangeArray(e)}
                                        id="propertyTypes"
                                        className="w-1/2 border border-gray-300 rounded-md p-2">
                                        <option value="" disabled selected>Select type</option>
                                        <option>Apartment</option>
                                        <option>Villa</option>
                                        <option>Commercial</option>
                                        <option>Land</option>
                                    </select>
                                    <div className="flex flex-wrap gap-2 mt-1 ">
                                        {preferences.propertyTypes.map((type, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-50 border border-blue-300 text-blue-700 px-2 py-0.5 rounded-full  flex items-center gap-2"
                                            >
                                                <span className="text-sm">{type}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeType(index, "propertyTypes")}
                                                    className="text-blue-500 hover:text-red-600 font-bold text-xs"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Price & Size */}
                    <div className="bg-gray-50 p-6 bord rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold  mb-4">Price & Size</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Min Price (₹{preferences.listingType[0] === "rent"
                                        ? "/month" : ""})</label>
                                <input value={preferences.minPrice} type="number" placeholder="100000"
                                    onChange={(e) => handleChange(e)}
                                    id="minPrice"
                                    className="w-full border border-gray-300 rounded-md p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Max Price (₹{preferences.listingType[0] === "rent"
                                        ? "/month" : ""})</label>
                                <input value={preferences.maxPrice} type="number" placeholder="500000"
                                    onChange={(e) => handleChange(e)}
                                    id="maxPrice"
                                    className="w-full border border-gray-300 rounded-md p-2" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium  mb-1">Min Size ({preferences.unit})</label>
                                <input value={preferences.minSize} type="number" placeholder="500"
                                    onChange={(e) => handleChange(e)}
                                    id="minSize"
                                    className="w-full border border-gray-300 rounded-md p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium  mb-2">Max Size ({preferences.unit})</label>
                                <input value={preferences.maxSize} type="number" placeholder="2000"
                                    onChange={(e) => handleChange(e)}
                                    id="maxSize"
                                    className="w-full border border-gray-300 rounded-md p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium  mb-2">Unit of Size</label>
                                <div className='flex flex-col gap-2'>
                                    <select
                                        onChange={(e) => handleChange(e)}
                                        id="unit"
                                        className="w-full border border-gray-300 rounded-md p-2">
                                        <option>sqft</option>
                                        <option>acres</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="inline-flex items-center">
                                <input id="offerOnly" checked={preferences.offerOnly} type="checkbox"
                                    onChange={(e) => handleChange(e)}
                                    className="form-checkbox text-blue-600" />
                                <span className="ml-2 text-sm font-semibold ">Show listings with offers only</span>
                            </label>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="bg-gray-50 p-6 bord rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold  mb-4">Features</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <input id="furnished" checked={preferences.furnished} type="checkbox"
                                    onChange={(e) => handleChange(e)}
                                    className="form-checkbox text-blue-600 mr-2" />
                                <span className="text-sm font-semibold">Furnished</span>
                            </div>
                            <div className="flex items-center">
                                <input id="parking" checked={preferences.parking} type="checkbox"
                                    onChange={(e) => handleChange(e)}
                                    className="form-checkbox text-blue-600 mr-2" />
                                <span className="text-sm font-semibold">Parking Available</span>
                            </div>
                        </div>
                    </div>

                    {/* Bedrooms & Bathrooms */}
                    <div className="bg-gray-50 p-6 bord rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold  mb-4">Bedrooms & Bathrooms</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium  mb-1">Min Bedrooms</label>
                                <input id="bedrooms" value={preferences.bedrooms} type="number" placeholder="e.g. 2"
                                    onChange={(e) => handleChange(e)}
                                    className="w-full border border-gray-300 rounded-md p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium  mb-1">Min Bathrooms</label>
                                <input id="bathrooms" value={preferences.bathrooms} type="number" placeholder="e.g. 2"
                                    onChange={(e) => handleChange(e)}
                                    className="w-full border border-gray-300 rounded-md p-2" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center pt-4">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                    >
                        Save Preferences
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Preferences;
