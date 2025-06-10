import React from 'react';

const formatIndianCurrency = (number) => {
    if (number >= 10000000) return (number / 10000000).toFixed(2) + ' Cr';
    if (number >= 100000) return (number / 100000).toFixed(2) + ' Lakh';
    if (number >= 1000) return (number / 1000).toFixed(2) + 'K';
    return number.toString();
};

const UserPreferencesTable = ({ preferences, loading }) => {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto max-h-[75vh] overflow-y-auto">
                <table className="min-w-full table-auto text-center text-sm">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr className="text-gray-600 font-semibold border-b">
                            <th className="p-3 "></th>
                            <th className="p-3 border-x">User</th>
                            <th className="p-3">Phone & Status</th>
                            <th className="p-3 border-x">Purchase Type</th>
                            <th className="p-3">Preferred Cities</th>
                            <th className="p-3 border-x">Property Types</th>
                            <th className="p-3">Price Range</th>
                            <th className="p-3 border-l">Size</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan="8" className="p-4 text-gray-400">Loading...</td>
                            </tr>
                        ) : preferences.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="p-4 text-gray-400">No preferences found.</td>
                            </tr>
                        ) : (
                            preferences.map((entry, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="p-3 font-medium">{index + 1}</td>

                                    <td className="p-3 border-l">
                                        <div className="flex items-center justify-center gap-2">
                                            <img
                                                src={entry.user?.avatar || 'https://via.placeholder.com/40'}
                                                alt="user"
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <div className="text-left">
                                                <p className="font-semibold">{entry.user?.username || 'N/A'}</p>
                                                <p className="text-xs text-gray-500">{entry.user?.email || '—'}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-3 border-l">
                                        <p className="font-medium">{entry.user?.phone || 'N/A'}</p>
                                        <p className="text-xs text-gray-500 mt-1">Contact Status:</p>
                                    </td>

                                    <td className="p-3 border-x">
                                        {entry.listingType?.[0] === 'sell' ? (
                                            <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full font-semibold">
                                                Sell
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full font-semibold">
                                                Rent
                                            </span>
                                        )}
                                    </td>

                                    <td className="p-3 border-r">
                                        <div className="flex flex-wrap justify-center gap-2 text-base">
                                            {entry.preferredCities?.map((city, i) => (
                                                <span
                                                    key={i}
                                                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium border"
                                                >
                                                    {city}
                                                </span>
                                            ))}
                                        </div>
                                    </td>

                                    <td className="p-3">
                                        <div className="flex flex-wrap justify-center gap-2 text-base">
                                            {entry.propertyTypes?.map((type, i) => (
                                                <span
                                                    key={i}
                                                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium border"
                                                >
                                                    {type}
                                                </span>
                                            ))}
                                        </div>
                                    </td>

                                    <td className="p-0.5 border leading-tight">
                                        <div className="text-xs text-gray-500">Min</div>
                                        <div className="font-medium">₹ {formatIndianCurrency(entry.minPrice)}</div>
                                        <div className="text-xs text-gray-500 mt-1">Max</div>
                                        <div className="font-medium">₹ {formatIndianCurrency(entry.maxPrice)}</div>
                                    </td>

                                    <td className="p-3 leading-tight">
                                        <div className="text-xs text-gray-500">Min</div>
                                        <div className="font-medium">{entry.minSize} {entry.unit}</div>
                                        <div className="text-xs text-gray-500 mt-1">Max</div>
                                        <div className="font-medium">{entry.maxSize} {entry.unit}</div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserPreferencesTable;

