import React from 'react';
import { useNavigate } from 'react-router-dom';

const InterestedUsersBroker = ({ data = [], loading }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto max-h-[75vh] overflow-y-auto">
            {loading ? (
                <p className="text-gray-400 text-center py-6">Loading...</p>
            ) : data.length === 0 ? (
                <p className="text-gray-400 text-center py-6">No interested users found.</p>
            ) : (
                <table className="min-w-full table-auto text-center text-sm">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr className="text-gray-600 font-semibold border-b">
                            <th className="p-3">Sr.no</th>
                            <th className="p-3 border-x">User</th>
                            <th className="p-3">Contact</th>
                            <th className="p-3 border-l">Interested Listings</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-gray-700">
                        {data.map((entry, index) => (
                            <tr key={index} className="hover:bg-gray-50 align-top">
                                <td className="p-3 font-medium">{index + 1}</td>

                                {/* User Info */}
                                <td className="p-3 border-x">
                                    <div className="flex items-center justify-center gap-2">
                                        <img
                                            src={entry.user?.avatar || 'https://via.placeholder.com/40'}
                                            alt="user"
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div className="text-left">
                                            <p className="font-semibold">{entry.user?.username || 'N/A'}</p>
                                            <p className="text-xs text-gray-500">{entry.user?.email}</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Phone */}
                                <td className="p-3">
                                    <p className="font-medium">{entry.user?.phone || 'N/A'}</p>
                                    <p className="text-xs text-gray-500 mt-1">Status: Contacted?</p>
                                </td>

                                {/* Listings */}
                                <td className="p-3 border-l">
                                    <div className="grid grid-flow-col gap-4 place-items-center">
                                        {entry.matchedListings?.map((listing, i) => (
                                            <div
                                                key={i}
                                                className="cursor-pointer flex items-center gap-3 w-60 border rounded-md overflow-hidden shadow-sm hover:shadow-md transition p-2"
                                                onClick={() => navigate(`/listing/${listing._id}`)}
                                            >
                                                <img
                                                    src={listing.image || 'https://via.placeholder.com/50'}
                                                    alt={listing.LisName}
                                                    className="w-12 h-12 object-cover rounded-md"
                                                />
                                                <div className="flex-1 text-left">
                                                    <p className="text-sm font-medium line-clamp-2">{listing.LisName}</p>
                                                    <button
                                                        className="text-xs text-blue-500 mt-1 hover:underline"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/listing/${listing._id}`);
                                                        }}
                                                    >
                                                        More Details
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default InterestedUsersBroker;
