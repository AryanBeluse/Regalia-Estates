import React, { useState, useEffect, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'

const UserProfile = () => {
    const {
        deleteUser,
        users,
        backendUrl,
        aToken,
        deleteListing,
        toggleVerify,
        formatIndianCurrency } = useContext(AdminContext)

    const navigate = useNavigate()

    const { id } = useParams()
    const [userListings, setUserListings] = useState([])
    const user = users.find(user => user._id === id)


    const getUserListings = async (userId) => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/userListings/${userId}`, {
                headers: {

                    "Authorization": `Bearer ${aToken}`,
                }
            })
            if (data.success) {
                setUserListings(data.userListings);
            }
        } catch (error) {
            console.log("No listings found", error);
        }
    }

    useEffect(() => {
        if (!user) return;

        const fetchListings = async () => {
            await getUserListings(user._id);
        };

        fetchListings();
    }, [user, toggleVerify]);

    if (!user) {
        return <p>User not found</p>;
    }

    return (
        <div className="w-full p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-700 mb-6">User Profile</h1>


            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">

                <div className="col-span-1 bg-white p-4 rounded-lg shadow-md border">
                    <div className="flex flex-col items-center mb-4">
                        <img
                            src={user.avatar || '/default-avatar.png'}
                            alt="User Avatar"
                            className="w-24 h-24 object-cover rounded-full border border-gray-300 mb-4"
                        />
                        <p className="text-xl font-semibold text-gray-800">{user.username}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>


                    <button
                        onClick={() => deleteUser(user._id)}
                        className=" mt-32 w-full px-6 py-2 bg-red-600 text-white rounded-md hover:opacity-80"
                    >
                        Delete User
                    </button>
                </div>


                <div className="col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Listings by {user.username}</h2>

                    {userListings.length > 0 ? (
                        <div className="space-y-4">
                            {userListings.map((listing) => (
                                <div
                                    key={listing._id}
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


                                    <div className="flex-1 px-2 w-full">
                                        <p className="text-lg font-semibold text-gray-800 cursor-pointer hover:underline"
                                            onClick={() => navigate(`/listing/${listing._id}`)}>
                                            {listing.LisName}{' '}
                                            {listing.verified && (
                                                <span
                                                    className="text-blue-600 font-medium bg-blue-100 gap-2 px-2 py-0.5 rounded-full text-xs"
                                                    title="Verified by Regalia Estates"
                                                >
                                                    Verified
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-500  flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-green-500" />
                                            {listing.address?.city}, {listing.address?.state}, {listing.address?.country}
                                        </p>
                                        <p className="text-sm mt-1 font-semibold">
                                            ₹{formatIndianCurrency(listing.discountPrice) || formatIndianCurrency(listing.regularPrice)}
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
                                    <div className="flex gap-2 mt-2 sm:mt-0">
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
                                            onClick={() => { deleteListing(listing._id), navigate("/users") }}
                                            className="px-3 py-1 rounded-lg bg-red-600 text-white hover:opacity-80"
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
            </div>
        </div>
    );

}

export default UserProfile
