import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { assets } from '../assets/assets.js'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { FaMapMarkerAlt } from "react-icons/fa";

const UserListing = () => {
    const { currentUser, token } = useSelector((state) => state.user)
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [userListings, setUserListings] = useState([])
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const getUserListings = async (userId) => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/listing/userListings/${userId}`, {
                headers: {

                    "Authorization": `Bearer ${token}`,
                }
            })
            if (data.success) {
                setUserListings(data.userListings);
            }
        } catch (error) {
            console.log("No listings found", error);
        }
    }

    const deleteListings = async (listingId) => {
        try {
            const res = await axios.delete(`${backendUrl}/api/listing/delete/${listingId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            if (res.data.success) {
                setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
                toast.success("Listing deleted successfully");
            } else {
                toast.error("Failed to delete listing");
            }
        } catch (error) {
            console.log("Error in frontend:", error);
            toast.error("Error deleting listing");
        }
    };

    const editListings = async (listingId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/listing/edit/${listingId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            })
            if (data.success) {

            }


        } catch (error) {
            console.log("Error in frontend:", error);
            toast.error("Error updating listing");
        }
    }



    useEffect(() => {
        if (!currentUser._id) return;

        const fetchListings = async () => {
            await getUserListings(currentUser._id);
        };

        fetchListings();
    }, [currentUser._id]);


    const formatIndianCurrency = (number) => {
        if (number >= 10000000) {
            return (number / 10000000).toFixed(2) + ' Cr';
        } else if (number >= 100000) {
            return (number / 100000).toFixed(2) + ' Lakh';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(2) + 'K';
        } else {
            return number.toString();
        }
    };



    return (
        <div className="w-full">
            <hr />
            {userListings?.length > 0 ? (
                <div className="divide-y divide-gray-300">
                    {userListings.reverse().slice(0, 4).map((userListing, index) => (
                        <div
                            key={index}
                            className="flex items-center p-3 hover:bg-gray-100 "
                        >
                            {/* Image Section (16:9 aspect ratio) */}
                            <div className="relative w-52 h-32 bg-gray-100 border border-gray-300 flex items-center justify-center rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    className="max-w-full max-h-full object-contain"
                                    src={userListing?.imageUrls[0] || ""}
                                    alt="Listing"
                                />
                            </div>

                            {/* Listing Details */}
                            <div className="flex flex-col justify-between px-4 flex-grow">
                                {/* Listing Name */}
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <p
                                        className="text-lg font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition"
                                        onClick={() => navigate(`/listing/${userListing._id}`)}
                                    >
                                        {userListing?.LisName || "No Title"}
                                    </p>
                                    {userListing.verified && (
                                        <span
                                            className="text-blue-600 font-medium bg-blue-100 gap-1 px-2 py-0.5 rounded-full text-xs cursor-pointer"
                                            title="Verified by Regalia Estates"
                                        >
                                            Verified
                                        </span>
                                    )}
                                </div>

                                {/* Location */}
                                <p className="text-gray-500 text-sm flex items-center gap-2 ">
                                    <FaMapMarkerAlt className="text-green-500" />
                                    {userListing?.address?.city || "N/A"},{" "}
                                    {userListing?.address?.state || "N/A"},{" "}
                                    {userListing?.address?.country || "N/A"}
                                </p>

                                {/* Short Description */}
                                <p className="text-gray-600 text-sm line-clamp-2 mt-2 mb-2">
                                    {userListing?.description.slice(0, 50) || "No description"}...
                                </p>



                                {/* Price & Status (For Sale / For Rent) */}
                                <div className="flex items-center gap-6 mt-1">
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold text-white rounded ${userListing?.features?.sell
                                            ? "bg-green-600"
                                            : userListing?.features?.rent
                                                ? "bg-blue-600"
                                                : "bg-gray-600"
                                            }`}
                                    >
                                        {userListing?.features?.sell
                                            ? "For Sale"
                                            : userListing?.features?.rent
                                                ? "For Rent"
                                                : "N/A"}
                                    </span>
                                    <p className="text-md font-semibold">
                                        ₹
                                        {userListing?.features?.sell
                                            ? formatIndianCurrency(userListing.discountPrice || userListing.regularPrice)
                                            : userListing?.features?.rent
                                                ? formatIndianCurrency(userListing.regularPrice) + '/month'
                                                : formatIndianCurrency(userListing.regularPrice || 0)}
                                    </p>
                                </div>

                                {/* Created At & Action Buttons */}
                                <div className="flex justify-between items-center text-sm mt-1">
                                    <p className="text-gray-500 text-xs">
                                        Created at: {userListing.createdAt
                                            ?.slice(0, 10)
                                            .split("-")
                                            .reverse()
                                            .join("-") || "N/A"}
                                    </p>

                                </div>

                            </div>
                            <div className="flex flex-col gap-3  mt-auto self-end">

                                <button
                                    className="px-3 py-1 text-white bg-green-600 border rounded-lg hover:opacity-60 "
                                    onClick={() => navigate(`/edit-listing/${userListing._id}`)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="px-3 py-1 text-white bg-red-600 border rounded-lg hover:opacity-60 "
                                    onClick={() => deleteListings(userListing._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* View All Listings */}
                    <p className="cursor-pointer pt-3 text-center text-sm text-blue-500 hover:underline"
                        onClick={() => { navigate("/your-listings") }}>
                        View all listings
                    </p>
                </div>
            ) : (
                <p className="text-center text-gray-500">No listings added</p>
            )}
        </div>
    );


}

export default UserListing
