import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';


const SavedListings = () => {
    const { currentUser, token } = useSelector((state) => state.user);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [savedListings, setSavedListings] = useState([]);
    const navigate = useNavigate();

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

    const getSavedListings = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/get-saved/${currentUser._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (data.success) {
                setSavedListings(data.savedUserListings);
            }
        } catch (error) {
            console.log(error.message);
            toast.error("An error occured!");
        }
    };

    useEffect(() => {
        if (currentUser?._id) {
            getSavedListings();
        }
    }, [currentUser._id]);

    return (
        <div className="flex justify-center items-start min-h-screen  ">
            <div className="bg-white w-full max-w-5xl">

                <hr />
                {savedListings?.length > 0 ? (
                    <div className="divide-y divide-gray-300">
                        {savedListings.reverse().map((saved, index) => (
                            saved.listings.map((listing, subIndex) => (
                                <div
                                    key={`${index}-${subIndex}`}
                                    className="flex items-center p-4 hover:bg-gray-100 transition"
                                >
                                    {/* Image */}
                                    <div className="relative w-52 h-32 bg-gray-100 border border-gray-300 flex items-center justify-center rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            className="max-w-full max-h-full object-contain"
                                            src={listing?.imageUrls[0] || ''}
                                            alt="Listing"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex flex-col justify-between px-6 flex-grow">
                                        {/* Title */}
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <p
                                                className="text-xl font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition"
                                                onClick={() => navigate(`/listing/${listing._id}`)}
                                            >
                                                {listing?.LisName || 'No Title'}
                                            </p>
                                            {listing.verified && (
                                                <span
                                                    className="text-blue-600 font-medium bg-blue-100 gap-1 px-2 py-0.5 rounded-full text-xs"
                                                    title="Verified by Regalia Estates"
                                                >
                                                    Verified
                                                </span>
                                            )}
                                        </div>

                                        {/* Location */}
                                        <p className="text-gray-500 text-sm flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-green-500" />
                                            {listing?.address?.city || 'N/A'}, {listing?.address?.state || 'N/A'}, {listing?.address?.country || 'N/A'}
                                        </p>

                                        {/* Description */}
                                        <p className="text-gray-600 text-sm line-clamp-2 mt-2 mb-2">
                                            {listing?.description?.slice(0, 50) || 'No description'}...
                                        </p>

                                        {/* Price & Status */}
                                        <div className="flex items-center gap-6 mt-1">
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold text-white rounded ${listing?.features?.sell
                                                    ? 'bg-green-600'
                                                    : listing?.features?.rent
                                                        ? 'bg-blue-600'
                                                        : 'bg-gray-600'
                                                    }`}
                                            >
                                                {listing?.features?.sell
                                                    ? 'For Sale'
                                                    : listing?.features?.rent
                                                        ? 'For Rent'
                                                        : 'N/A'}
                                            </span>

                                            <p className="text-md font-semibold">
                                                ₹
                                                {listing?.features?.sell
                                                    ? formatIndianCurrency(listing.discountPrice || listing.regularPrice)
                                                    : listing?.features?.rent
                                                        ? formatIndianCurrency(listing.regularPrice) + '/month'
                                                        : formatIndianCurrency(listing.regularPrice || 0)}
                                            </p>
                                        </div>

                                        {/* Saved At */}
                                        <div className="flex justify-between items-center text-sm mt-1">
                                            <p className="text-gray-500 text-xs">
                                                Saved at: {saved.createdAt
                                                    ?.slice(0, 10)
                                                    .split('-')
                                                    .reverse()
                                                    .join('-') || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ))}
                        <hr />
                    </div>

                ) : (
                    <p className="text-center text-gray-500">No saved listings found.</p>
                )}
            </div>
        </div>
    );

};

export default SavedListings;
