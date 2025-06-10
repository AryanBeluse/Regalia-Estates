import React, { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const UsersList = () => {

    const { users, deleteUser } = useContext(AdminContext);
    const recentUsers = [...users].reverse();
    const navigate = useNavigate()


    return (
        <div className="w-full p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-700 mb-6">All Users ({users.length})</h1>

            {recentUsers?.length > 0 ? (
                <div className="space-y-4">
                    {recentUsers.map((user, index) => (
                        <div
                            key={index}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white shadow-md rounded-lg border"
                        >
                            {/* Image */}
                            <div className="w-full sm:w-32 h-32 overflow-hidden rounded-full border border-gray-500 flex items-center justify-center">
                                <img
                                    src={user.avatar}
                                    alt="user"
                                    className="object-cover w-full h-full rounded-full"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 px-2 w-full">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <p className="text-lg font-semibold text-gray-800 hover:underline cursor-pointer"
                                        onClick={() => { navigate(`/user/${user._id}`) }}>
                                        {user.username}
                                    </p>

                                </div>
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    {user.email}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-4 mt-2 sm:mt-0 self-start sm:self-center">
                                <button
                                    onClick={() => deleteUser(user._id)}
                                    className="px-3 py-1 text-sm rounded-lg bg-red-600 text-white hover:opacity-80"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-10">No users available</p>
            )}
        </div>
    );

}

export default UsersList
