import React, { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

const ListingsList = () => {
    const { listings, formatIndianCurrency, deleteListing, toggleVerify } = useContext(AdminContext);
    const recentlistings = [...listings].reverse();
    const navigate = useNavigate()




    return (
        <div className="w-full p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-700 mb-6">All Listings ({listings.length})</h1>

            {recentlistings?.length > 0 ? (
                <div className="space-y-4">
                    {recentlistings.map((listing, index) => (
                        <div
                            key={index}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white shadow-md rounded-lg border"
                        >
                            {/* Image */}
                            <div className="w-full sm:w-48 h-32 overflow-hidden rounded-md border bg-gray-100 flex items-center justify-center">
                                <img
                                    src={listing.imageUrls[0]}
                                    alt="Listing"
                                    className="object-cover w-full h-full cursor-pointer"
                                    onClick={() => navigate(`/listing/${listing._id}`)}
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 px-2 w-full">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <p className="text-lg font-semibold text-gray-800 hover:underline cursor-pointer"
                                        onClick={() => { navigate(`/listing/${listing._id}`) }}>
                                        {listing.LisName}
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
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-green-500" />
                                    {listing.address?.city}, {listing.address?.state}, {listing.address?.country}
                                </p>
                                <p className="text-md font-semibold mt-1">
                                    ₹{formatIndianCurrency(listing.discountPrice || listing.regularPrice)}
                                </p>
                                <span
                                    className={`inline-block text-xs font-semibold mt-1 px-2 py-1 rounded-full text-white ${listing.features.sell
                                        ? 'bg-green-600'
                                        : listing.features.rent
                                            ? 'bg-blue-600'
                                            : listing.features.offer
                                                ? 'bg-orange-500'
                                                : 'bg-gray-500'
                                        }`}
                                >
                                    {listing.features.sell
                                        ? 'For Sale'
                                        : listing.features.rent
                                            ? 'For Rent'
                                            : listing.features.offer
                                                ? 'Offer'
                                                : 'N/A'}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-4 mt-2 sm:mt-0 self-start sm:self-center">
                                <button
                                    onClick={() => toggleVerify(listing._id)}
                                    className={`px-3 py-1 text-sm rounded-lg border ${listing.verified
                                        ? 'bg-white text-gray-700 border-gray-400'
                                        : 'bg-blue-500 text-white border-blue-500'
                                        } hover:opacity-80`}
                                >
                                    {listing.verified ? 'Unverify' : 'Verify'}
                                </button>
                                <button
                                    onClick={() => deleteListing(listing._id)}
                                    className="px-3 py-1 text-sm rounded-lg bg-red-600 text-white hover:opacity-80"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-10">No listings available</p>
            )}
        </div>
    );

}
export default ListingsList;
