import { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { FaEnvelope, FaChalkboardTeacher, FaCalendarAlt } from 'react-icons/fa';

const Home = () => {
    const { listings, users, getUsers } = useContext(AdminContext);
    const navigate = useNavigate();

    const reversedusers = [...users].reverse();
    const reversedlistings = [...listings].reverse();

    const recentusers = reversedusers.slice(0, 5);
    const recentlistings = reversedlistings.slice(0, 5);


    // console.log(listings);


    return (
        <div className="px-8 py-6 w-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-lg text-gray-600">Total Users</h2>
                    <p className="text-3xl font-bold text-blue-600">{users.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-lg text-gray-600">Total Listings</h2>
                    <p className="text-3xl font-bold text-green-600">{listings.length}</p>
                </div>
            </div>

            {/* Recently Added Section */}
            <div className="flex gap-6">
                {/* users Box */}
                <div className="w-1/2 bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-semibold text-gray-800">Recently Added Users</h2>
                    </div>
                    <div>
                        {recentusers.map(user => (
                            <div
                                key={user._id}
                                className="flex items-center justify-between px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 transition cursor-pointer"
                                onClick={() => navigate(`/user/${user._id}`)}
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={user.avatar || assets.upload_area}
                                        alt="user"
                                        className="w-10 h-10 object-cover rounded-full border"
                                    />
                                    <div>
                                        <p className="text-gray-800 font-medium hover:underline">{user.username}</p>
                                        <p className="text-sm text-gray-500 flex items-center  gap-1">
                                            <FaEnvelope className="text-gray-400" />
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <hr className='border-gray-50' />
                    </div>
                </div>

                {/* listings Box */}
                <div className="w-1/2 bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-semibold text-gray-800">Recently Added Listings</h2>
                    </div>
                    <div>
                        {recentlistings.map(listing => (
                            <div
                                key={listing._id}
                                className="flex items-center justify-between px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 transition cursor-pointer"
                                onClick={() => navigate(`/listing/${listing._id}`)}
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={listing.imageUrls?.[0]}
                                        alt="user"
                                        className="w-10 h-10 object-cover rounded-full border"
                                    />
                                    <div>
                                        <p className="text-gray-800 font-medium hover:underline">{listing.LisName}</p>
                                        <div className={`flex items-center gap-2 font font-semibold text-sm  ${listing.status === 'available' ? "text-green-600" : "text-gray-500"
                                            }`}>
                                            <span className={`w-2 h-2 rounded-full ${listing.status === 'available' ? "bg-green-500" : "bg-gray-400"
                                                }`} />
                                            <span className='capitalize '>{listing.status}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
