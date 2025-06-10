import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { assets } from '../assets/assets'
import { useRef } from 'react'
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure
} from '../redux/user/userSlice.js'
import { FaPhone, FaEnvelope } from 'react-icons/fa';
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import UserListing from '../components/UserListing.jsx'
import { NavLink } from 'react-router-dom'
import { signOutUserSuccess, signOutUserStart } from '../redux/user/userSlice.js';
import Preferences from './Preferences.jsx'
import SavedListings from './SavedListings.jsx'
import ChatList from './ChatList.jsx'
import CreateListing from './CreateListing.jsx'
import Dashboard from './Dashboard.jsx'
const Profile = () => {

    const { currentUser, token } = useSelector((state) => state.user)
    const [isEdit, setEdit] = useState(false)
    const [formData, setFormData] = useState({
        username: currentUser?.username || "",
        email: currentUser?.email || "",
    })
    const navigate = useNavigate()
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const fileRef = useRef(null)
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const dispatch = useDispatch()
    const [activeTab, setActiveTab] = useState("Chats");



    const handleSignOut = () => {
        dispatch(signOutUserStart())
        dispatch(signOutUserSuccess())
    }

    const handleImagepreview = (e) => {
        const file = e.target.files[0]

        if (file) {
            const objectUrl = URL.createObjectURL(file)
            setImage(file)
            setImagePreview(objectUrl)

        }
    }

    const handleChange = (e) => {
        setFormData(
            {
                ...formData,
                [e.target.id]: e.target.value
            }
        )
    }

    const updateUserProfile = async () => {
        const updatedFormData = new FormData();

        if (formData.username) updatedFormData.append('username', formData.username);
        if (formData.email) updatedFormData.append('email', formData.email);
        if (image) updatedFormData.append('image', image);


        try {
            dispatch(updateUserStart());

            const { data } = await axios.put(
                `${backendUrl}/api/user/update/${currentUser._id}`,
                updatedFormData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (data.success) {
                setEdit(false);
                dispatch(updateUserSuccess(data.user));
                toast.success("Profile updated successfully")

            }
        } catch (error) {
            console.log("Vishay zhala bekar", error.message);
            dispatch(updateUserFailure(error.message));
            toast.error(error.message)
        }

    }


    useEffect(() => {
        setFormData({
            username: currentUser?.username || "",
            email: currentUser?.email || "",
        });
    }, [currentUser]);

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    // console.log("token in profile", token);
    // console.log(currentUser.avatar);

    console.log(currentUser);


    if (!token) {
        return <p className='text-xl font-semibold mt-10 text-red-600 flex justify-center items-center'>Unauthorized access, Please Login</p>;
    }

    return (
        <div className="mt-2 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-4">

                {/* Profile Image & Info */}
                <div className="bg-white rounded-xl col-span-1  min-h-screen shadow-lg p-6 flex flex-col items-center gap-4 relative">
                    <div className="relative">
                        <input
                            type="file"
                            ref={fileRef}
                            hidden
                            accept="image/*"
                            onChange={handleImagepreview}
                        />
                        <img
                            className="w-40 h-40 object-cover rounded-full border border-gray-300 shadow cursor-pointer hover:opacity-80 transition"
                            src={currentUser.avatar}
                            alt="User Avatar"
                            onClick={() => isEdit && fileRef.current.click()}
                        />
                        {isEdit && (
                            <img
                                className="absolute bottom-2 right-2 w-9 h-9 p-1 bg-gray-500 border rounded-full shadow cursor-pointer"
                                src={assets.uploadIcon}
                                alt="Upload Icon"
                                onClick={() => fileRef.current.click()}
                            />
                        )}
                    </div>

                    {isEdit ? (
                        <div className="w-full space-y-2">
                            {/* Username */}
                            <div className="flex flex-col">
                                <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Username"
                                    onChange={handleChange}
                                    value={formData.username}
                                    className="text-base px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Email */}
                            <div className="flex flex-col">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Email"
                                    onChange={handleChange}
                                    value={formData.email}
                                    className="text-base px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Phone */}
                            <div className="flex flex-col">
                                <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    placeholder="Phone Number"
                                    onChange={handleChange}
                                    value={formData.phone}
                                    className="text-base px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <p className="text-2xl font-semibold text-gray-800">
                                        {currentUser.username}
                                    </p>
                                    {currentUser.isBroker && (
                                        <span className="text-blue-600 border border-blue-600 font-medium bg-blue-100 px-2 py-0.5 rounded-full text-sm hover:cursor-pointer"
                                            title="Verified Broker by Regalia Estates">
                                            Broker
                                        </span>
                                    )}
                                </div>

                                <div className="flex  items-center gap-2 text-gray-600">
                                    <FaEnvelope className='text-gray-400' />
                                    <span>{currentUser.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <FaPhone className='text-gray-400' />
                                    <span>{currentUser.phone}</span>
                                </div>
                            </div>
                        </>
                    )}


                    <div className="flex flex-col md:flex-row md:flex-wrap gap-4 mt-2 justify-center">
                        {isEdit ? (
                            <button
                                onClick={updateUserProfile}
                                className="flex items-center gap-3 py-3.5 px-4 md:px-6 w-full md:w-72 border border-gray-300 rounded-md hover:bg-gray-100 "
                            >
                                <img className="w-6 h-6" src={assets.saveuserIcon} alt="Save" />
                                <span className='hover:text-green-600'>Save Info</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setEdit(true);
                                    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                                }}
                                className="flex items-center gap-3 py-3.5 px-4 md:px-6 w-full md:w-72 border border-gray-300 rounded-md hover:bg-gray-100 "
                            >
                                <img className="w-6 h-6" src={assets.editIcon} alt="Edit" />
                                <span>Edit Info</span>
                            </button>
                        )}

                        {currentUser.isBroker &&
                            <div className="flex items-center gap-3 py-3.5 px-4 md:px-6 w-full md:w-72 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer "
                                onClick={() => navigate("/Dashboard")}>
                                <img className="w-6 h-6" src={assets.yourListingIcon} alt="Your Listings" />
                                <span>Dashboard</span>
                            </div>}

                        {!currentUser.isBroker && <div className={`flex items-center gap-3 py-3.5 px-4 md:px-6 w-full md:w-72 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer  
                            ${activeTab === "Preferences" ? "bg-gray-100" : ""}`}
                            onClick={() => {
                                setActiveTab("Preferences");
                                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                            }} >
                            <img className="w-6 h-6" src={assets.preferences} alt="Your Preferences" />
                            <span>Preferences</span>
                        </div>}

                        {currentUser.isBroker &&
                            <div className={`flex items-center gap-3 py-3.5 px-4 md:px-6 w-full md:w-72 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer  
                            ${activeTab === "Create Listing" ? "bg-gray-100" : ""}`}
                                onClick={() => {
                                    setActiveTab("Create Listing");
                                    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                                }} >
                                <img className="w-6 h-6" src={assets.listing} alt="Create Listing" />
                                <span>Create Listing</span>
                            </div>}

                        <div className={`flex items-center gap-3 py-3.5 px-4 md:px-6 w-full md:w-72 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer  
                            ${activeTab === "Chats" ? "bg-gray-100" : ""}`}
                            onClick={() => {
                                setActiveTab("Chats");
                                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                            }} >
                            <img className="w-6 h-5" src={assets.chatBtn} alt="Chats" />
                            <span>Your Chats</span>
                        </div>

                        {currentUser.isBroker &&
                            <div className={`flex items-center gap-3 py-3.5 px-4 md:px-6 w-full md:w-72 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer  
                            ${activeTab === "dash" ? "bg-gray-100" : ""}`}
                                onClick={() => {
                                    setActiveTab("dash");
                                    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                                }} >
                                <img className="w-6 h-6" src={assets.yourListingIcon} alt="Your Listings" />
                                <span>Your</span>
                            </div>}

                        {currentUser.isBroker &&
                            <div className={`flex items-center gap-3 py-3.5 px-4 md:px-6 w-full md:w-72 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer  
                            ${activeTab === "Listings" ? "bg-gray-100" : ""}`}
                                onClick={() => {
                                    setActiveTab("Listings");
                                    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                                }} >
                                <img className="w-6 h-6" src={assets.yourListingIcon} alt="Your Listings" />
                                <span>Your Listings</span>
                            </div>}

                        <div className={`flex items-center gap-3 py-3.5 px-4 md:px-6 w-full md:w-72 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer  
                            ${activeTab === "Saved Listings" ? "bg-gray-100" : ""}`}
                            onClick={() => {
                                setActiveTab("Saved Listings");
                                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                            }}>
                            <img className="w-6 h-6" src={assets.saveIcon} alt="Saved Listings" />
                            <span>Saved Listings</span>
                        </div>

                        <button
                            className="flex w-1/3 bg-red-500 text-white font-semibold gap-3 py-3.5 px-4 md:px-6  md:w-72 border border-gray-300 rounded-md hover:opacity-85 cursor-pointer "
                            onClick={() => {
                                handleSignOut();
                                navigate("/sign-in");
                            }} >
                            <span>Logout</span>
                        </button>

                    </div>
                </div>

                {/* Listings Section */}
                <div className="col-span-2 bg-white rounded-xl shadow-lg p-6 ">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{activeTab}</h2>


                    {activeTab === "Preferences" && <Preferences />}
                    {activeTab === "Saved Listings" && <SavedListings />}
                    {activeTab === "Chats" && <ChatList />}
                    {activeTab === "Listings" && < UserListing />}
                    {activeTab === "Create Listing" && < CreateListing />}
                    {activeTab === "dash" && < Dashboard />}
                </div>

            </div>
        </div >
    );

}

export default Profile
