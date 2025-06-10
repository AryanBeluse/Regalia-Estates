import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
    FaBath, FaBed, FaMapMarkerAlt, FaParking, FaChair, FaCheckCircle
} from 'react-icons/fa';
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import ListingChatRoom from '../components/ListingChatRoom'

const Listing = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { listingId } = useParams();
    const [listing, setListing] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const { currentUser, token } = useSelector((state) => state.user)
    const { broker, setBroker } = useState("")
    const [showChatRoom, setShowChatRoom] = useState(false);





    useEffect(() => {
        const fetchListing = async () => {
            if (!listingId) return;
            try {
                const { data } = await axios.get(`${backendUrl}/api/listing/get/${listingId}`);
                if (data.success) {
                    setListing(data.listingData);
                    setMainImage(data.listingData.imageUrls[0])
                }
            } catch (error) {
                console.log("Error fetching listing:", error);
            }
        };
        fetchListing();
    }, [listingId]);

    const saveListing = async () => {
        const userId = currentUser._id
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/save-listing`,
                { userId, listingId },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            if (data.success) {
                toast.success("Listing Saved!")
            }
        } catch (error) {
            toast.error(error.message)
            console.log("Error saving listing:", error);
        }
    }

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
        listing && (
            <div className="max-w-full px-24 mx-auto p-4">
                {/* Image & Sidebar Container */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2">
                        <div className="flex gap-4">
                            {/* Large Main Image */}
                            <div className="w-3/4 aspect-[16/9] flex items-center justify-center bg-gray-200 border-2  rounded-lg overflow-hidden shadow-md hover:border-gray-500">
                                <img
                                    src={mainImage}
                                    alt="Main Image"
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            {/* Side Thumbnails with Borders & 16:9 Aspect Ratio */}
                            <div className={`flex flex-col justify-between gap-2 
                                ${listing.imageUrls.length === 3 ? "w-1/4" : "w-1/5"}`}>
                                {listing.imageUrls.slice(0, 4).map((image, index) => (
                                    <div key={index} className="w-full aspect-[16/9] border-2 rounded-lg overflow-hidden cursor-pointer bg-gray-200 hover:border-gray-500 shadow-md ">
                                        <img
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-contain"
                                            onClick={() => setMainImage(image)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Property Details */}
                        <div className="mt-6">
                            <h1 className="text-3xl font-semibold gap-4 flex items-center flex-wrap">
                                {listing.LisName}
                                {listing.verified && (
                                    <span className="flex items-center gap-1 text-xs px-2 py-1 border border-blue-700 rounded-full text-blue-600 bg-blue-50 font-medium hover:cursor-pointer"
                                        title='Verified by Regalia Estates '>
                                        <FaCheckCircle className="text-blue-700" /> Verified
                                    </span>
                                )}
                            </h1>
                            <p className="flex items-center text-gray-600 text-sm mt-2">
                                <FaMapMarkerAlt className="text-green-600 mr-2" />
                                {listing.address.propertyName}, {listing.address.city}, {listing.address.state}, {listing.address.country}
                            </p>

                            <div className="mt-4 flex items-center gap-3">
                                <p className="text-2xl font-semibold">
                                    ₹
                                    {listing?.features?.sell
                                        ? formatIndianCurrency(listing.discountPrice || listing.regularPrice)
                                        : listing?.features?.rent
                                            ? formatIndianCurrency(listing.discountPrice) + '/month'
                                            : formatIndianCurrency(listing.regularPrice || 0)}
                                </p>
                                {listing.features.sell && <span className='text-white p-2 border rounded-lg  bg-green-600'>
                                    For Sale</span>}
                                {listing.features.rent && <span className="text-gray-700 ">
                                    <span className='text-white p-2 border rounded-lg bg-blue-600 ml-4'>
                                        For Rent</span></span>}

                                <p className="text-white p-2 border rounded-lg bg-indigo-700 ">
                                    {listing.discountPrice && listing.regularPrice
                                        ? `${(((Number(listing.regularPrice) - Number(listing.discountPrice)) / Number(listing.regularPrice)) * 100).toFixed(0)}% off`
                                        : ''}
                                </p>
                            </div>

                            <p className="mt-4 p-3 bg-white rounded-lg shadow-md text-gray-700 border ">{listing.description}</p>
                        </div>

                    </div>

                    {/* Sidebar */}
                    <div className="bg-white shadow-lg p-6 rounded-lg space-y-6 h-fit min-h-screen">
                        {showChatRoom ? (
                            // Chat Room Mode
                            <ListingChatRoom
                                broker={listing.userRef}
                                listingId={listingId}
                                onBack={() => setShowChatRoom(false)}
                            />
                        ) : (
                            // Normal Sidebar Mode
                            <>
                                {/* Property Details */}
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 border-b pb-2 ">Property Details</h2>
                                    <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-md text-sm text-gray-800">
                                        <div>
                                            <span className="font-semibold block text-gray-800">Type</span>
                                            <span className="capitalize">{listing.type}</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold block text-gray-800">Status</span>
                                            <span className={`capitalize ${listing.status === "available" ? "text-green-500 font-semibold" : "text-black"}`}>
                                                {listing.status}
                                            </span>

                                        </div>
                                        <div >
                                            <span className="font-semibold block text-gray-800">Size</span>
                                            {listing.size?.value} {listing.size?.unit}
                                        </div>
                                        <div>
                                            <span className="font-semibold block text-gray-800">Regular Price</span>
                                            <p className="text-sm ">
                                                ₹
                                                {listing?.features?.sell
                                                    ? formatIndianCurrency(listing.regularPrice)
                                                    : listing?.features?.rent
                                                        ? formatIndianCurrency(listing.regularPrice) + '/month'
                                                        : formatIndianCurrency(listing.regularPrice)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Features Grid */}
                                <div >
                                    <h2 className="text-xl font-semibold mb-4 border-b pb-2 ">Features</h2>
                                    <div className="grid grid-cols-2 font-semibold gap-4 text-sm text-gray-800">
                                        <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-md">
                                            <FaBed className="text-blue-600 text-lg" />
                                            {listing.bedrooms} {listing.bedrooms > 1 ? "Beds" : "Bed"}
                                        </div>
                                        <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-md">
                                            <FaBath className="text-blue-600 text-lg" />
                                            {listing.bathrooms} {listing.bathrooms > 1 ? "Baths" : "Bath"}
                                        </div>
                                        <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-md">
                                            <FaParking className="text-blue-600 text-lg" />
                                            {listing.features.parking ? "Parking" : "No Parking"}
                                        </div>
                                        {listing.features.furnished && (
                                            <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-md">
                                                <FaChair className="text-blue-600 text-lg" />
                                                Furnished
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Broker Details</h2>
                                    <div className="flex items-center gap-4 p-3 bg-gray-100 rounded-md shadow-sm">
                                        <img
                                            src={listing.userRef.avatar}
                                            alt="Broker Avatar"
                                            className="w-12 h-12 rounded-full object-cover border"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-md font-semibold text-gray-800">
                                                {listing.userRef.username}
                                                {listing.userRef._id === currentUser._id ? <span> (You)</span> : ""}
                                            </span>
                                            <span className="text-sm text-gray-600">{listing.userRef.email}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Buttons */}

                                {listing.userRef._id !== currentUser._id &&
                                    <div className="flex gap-2 pt-4">
                                        <button
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 transition"
                                            onClick={() => setShowChatRoom(true)}
                                        >
                                            Send Message
                                        </button>
                                        <button
                                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md w-full hover:bg-gray-300 transition"
                                            onClick={saveListing}
                                        >
                                            Save Place
                                        </button>
                                    </div>}
                            </>
                        )}
                    </div>

                </div>
            </div >
        )
    );
};

export default Listing;
