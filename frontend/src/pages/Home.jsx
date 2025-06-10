import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import axios from 'axios';
import { FaHome, FaRegBuilding, FaMoneyBillWave, FaUsers } from 'react-icons/fa';

export default function Home() {
    const [offerListings, setOfferListings] = useState([]);
    const [saleListings, setSaleListings] = useState([]);
    const [rentListings, setRentListings] = useState([]);

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    useEffect(() => {
        const fetchListings = async () => {
            try {
                if (!backendUrl) {
                    console.error('VITE_BACKEND_URL is not defined');
                    return;
                }

                const [offerRes, rentRes, saleRes] = await Promise.all([
                    axios.get(`${backendUrl}/api/listing/search?offer=true&limit=3`),
                    axios.get(`${backendUrl}/api/listing/search?type=rent&limit=3`),
                    axios.get(`${backendUrl}/api/listing/search?type=sale&limit=3`),
                ]);

                setOfferListings(offerRes.data.listings);
                setRentListings(rentRes.data.listings);
                setSaleListings(saleRes.data.listings);
            } catch (error) {
                console.error('Failed to fetch listings:', error);
            }
        };

        fetchListings();
    }, [backendUrl]);



    return (
        <div>

            {/* Hero Section */}
            <div className=' py-28 px-3 max-w-7xl mx-auto text-center'>
                <h1 className='text-gray-800 font-extrabold text-4xl md:text-6xl'>
                    Discover your dream <br /> home with <span className='text-blue-700'>Regalia Estates</span>
                </h1>
                <p className='mt-6 text-gray-600 max-w-xl mx-auto text-base md:text-lg'>
                    Regalia Estates brings you curated listings in the most desirable locations. From cozy apartments to luxurious villas — find a place that truly feels like home.
                </p>
                <Link
                    to='/search'
                    className='mt-8 inline-block bg-blue-600 text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-blue-700 transition'
                >
                    Browse Listings
                </Link>
            </div>

            {/* Feature Highlights */}
            <section className="max-w-6xl mx-auto mt-5 mb-8 py-5 px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div className="flex flex-col items-center">
                    <FaHome className="text-4xl text-blue-600 mb-3" />
                    <h3 className="font-semibold text-lg">Wide Range of Homes</h3>
                    <p className="text-sm text-gray-500">Apartments, villas, bungalows, and more — all in one place.</p>
                </div>
                <div className="flex flex-col items-center">
                    <FaRegBuilding className="text-4xl text-blue-600 mb-3" />
                    <h3 className="font-semibold text-lg">Commercial Spaces</h3>
                    <p className="text-sm text-gray-500">Find perfect spaces for your office, shop, or showroom.</p>
                </div>
                <div className="flex flex-col items-center">
                    <FaMoneyBillWave className="text-4xl text-blue-600 mb-3" />
                    <h3 className="font-semibold text-lg">Transparent Deals</h3>
                    <p className="text-sm text-gray-500">No hidden fees, fair pricing and verified properties.</p>
                </div>
                <div className="flex flex-col items-center">
                    <FaUsers className="text-4xl text-blue-600 mb-3" />
                    <h3 className="font-semibold text-lg">Trusted by Thousands</h3>
                    <p className="text-sm text-gray-500">Join a growing community of happy homeowners & tenants.</p>
                </div>
            </section>

            {/* Listings Section */}
            <div className='max-w-6xl mx-auto px-4 py-10 flex flex-col gap-12'>
                {offerListings.length > 0 && (
                    <section className='bg-white shadow-md rounded-2xl p-6'>
                        <div className='mb-4 flex items-center justify-between border-b pb-3'>
                            <h2 className='text-2xl font-bold text-gray-800'>Hot Offers</h2>
                            <Link to='/search?offer=true' className='text-sm text-blue-600 hover:underline font-medium'>
                                Show more offers
                            </Link>
                        </div>
                        <div className='flex flex-wrap gap-6 justify-start'>
                            {offerListings.map((listing) => (
                                <ListingItem key={listing._id} listing={listing} />
                            ))}
                        </div>
                    </section>
                )}

                {rentListings.length > 0 && (
                    <section className='bg-white shadow-md rounded-2xl p-6'>
                        <div className='mb-4 flex items-center justify-between border-b pb-3'>
                            <h2 className='text-2xl font-bold text-gray-800'>For Rent</h2>
                            <Link to='/search?type=rent' className='text-sm text-blue-600 hover:underline font-medium'>
                                Show more rentals
                            </Link>
                        </div>
                        <div className='flex flex-wrap gap-6 justify-start'>
                            {rentListings.map((listing) => (
                                <ListingItem key={listing._id} listing={listing} />
                            ))}
                        </div>
                    </section>
                )}

                {saleListings.length > 0 && (
                    <section className='bg-white shadow-md rounded-2xl p-6'>
                        <div className='mb-4 flex items-center justify-between border-b pb-3'>
                            <h2 className='text-2xl font-bold text-gray-800'>For Sale</h2>
                            <Link to='/search?type=sale' className='text-sm text-blue-600 hover:underline font-medium'>
                                Show more properties
                            </Link>
                        </div>
                        <div className='flex flex-wrap gap-6 justify-start'>
                            {saleListings.map((listing) => (
                                <ListingItem key={listing._id} listing={listing} />
                            ))}
                        </div>
                    </section>
                )}
            </div>


        </div>
    );
}
