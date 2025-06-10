import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ListingItem from '../components/ListingItem';

export default function Search() {
    const navigate = useNavigate();
    const location = useLocation();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        type: 'all',
        propertyTypes: [],
        parking: false,
        furnished: false,
        offer: false,
        verified: false,
        sort: 'createdAt',
        order: 'desc',
    });

    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const verifiedFromUrl = urlParams.get('verified');
        const propertyTypesFromUrl = urlParams.getAll('propertyType');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        setSidebardata({
            searchTerm: searchTermFromUrl || '',
            type: typeFromUrl || 'all',
            propertyTypes: propertyTypesFromUrl || [],
            parking: parkingFromUrl === 'true',
            furnished: furnishedFromUrl === 'true',
            offer: offerFromUrl === 'true',
            verified: verifiedFromUrl === 'true',
            sort: sortFromUrl || 'createdAt',
            order: orderFromUrl || 'desc',
        });

        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);
            try {
                const { data } = await axios.get(`${backendUrl}/api/listing/search?${urlParams.toString()}`);
                if (data.success) {
                    setListings(data.listings);
                    setShowMore(data.listings.length > 8);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [location.search]);

    const handleChange = (e) => {
        const { id, value, checked } = e.target;
        if (['all', 'rent', 'sale'].includes(id)) {
            setSidebardata((prev) => ({ ...prev, type: id }));
        } else if (id === 'searchTerm') {
            setSidebardata((prev) => ({ ...prev, searchTerm: value }));
        } else if (['parking', 'furnished', 'offer', 'verified'].includes(id)) {
            setSidebardata((prev) => ({ ...prev, [id]: checked }));
        } else if (id === 'sort_order') {
            const [sort, order] = value.split('_');
            setSidebardata((prev) => ({ ...prev, sort, order }));
        } else if (id === 'propertyTypes') {
            const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
            setSidebardata((prev) => ({ ...prev, propertyTypes: selectedOptions }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams({
            searchTerm: sidebardata.searchTerm,
            type: sidebardata.type,
            parking: sidebardata.parking,
            furnished: sidebardata.furnished,
            offer: sidebardata.offer,
            sort: sidebardata.sort,
            order: sidebardata.order,
            verified: sidebardata.verified,
        });

        sidebardata.propertyTypes.forEach((type) => {
            params.append('propertyType', type);
        });

        navigate(`/search?${params.toString()}`);
    };

    const onShowMoreClick = async () => {
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', listings.length);
        try {
            const res = await axios.get(`${backendUrl}/api/listing/search?${urlParams.toString()}`);
            const newData = res.data.listings || [];
            setListings((prev) => [...prev, ...newData]);
            if (newData.length < 9) setShowMore(false);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='flex flex-col md:flex-row  min-h-screen'>
            {/* Sidebar */}
            <aside className='w-full md:w-1/3 lg:w-1/4 bg-white border-r shadow-sm p-6 border-t'>
                <form onSubmit={handleSubmit} className='space-y-6'>
                    <h2 className='text-xl font-semibold text-slate-700'>Search Filters</h2>

                    {/* Search Term */}
                    <div>
                        <label className='block text-sm font-medium mb-1'>Search Term</label>
                        <input
                            type='text'
                            id='searchTerm'
                            placeholder='Search by name or city...'
                            className='w-full border rounded-lg p-3'
                            value={sidebardata.searchTerm}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Property Type (radio group) */}
                    <div>
                        {/* Verified */}
                        <label className='flex items-center gap-2 mb-5 text-sm font-semibold'>
                            <input
                                type='checkbox'
                                id='verified'
                                className='w-4 h-4 accent-green-600'
                                onChange={handleChange}
                                checked={!!sidebardata.verified}
                            />
                            Verified
                        </label>

                        <label className='block text-sm font-medium mb-2'>Listing Type</label>
                        <div className='flex gap-3 flex-wrap'>
                            {['all', 'rent', 'sale'].map((type) => (
                                <label key={type} className='flex items-center gap-2 text-sm'>
                                    <input
                                        type='checkbox'
                                        id={type}
                                        className='w-4 h-4 accent-blue-600'
                                        onChange={handleChange}
                                        checked={sidebardata.type === type}
                                    />
                                    <span className='capitalize'>{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Property Category (multi-select) */}
                    <div>
                        <label className='block text-sm font-medium mb-2'>Property Types</label>
                        <div className='flex flex-wrap gap-4'>
                            {['apartment', 'house', 'villa', 'commercial', 'land'].map((type) => (
                                <label key={type} className='flex items-center gap-2 text-sm'>
                                    <input
                                        type='checkbox'
                                        id='propertyTypes'
                                        value={type}
                                        checked={sidebardata.propertyTypes.includes(type)}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const checked = e.target.checked;
                                            setSidebardata((prev) => ({
                                                ...prev,
                                                propertyTypes: checked
                                                    ? [...prev.propertyTypes, value]
                                                    : prev.propertyTypes.filter((t) => t !== value),
                                            }));
                                        }}
                                        className='w-4 h-4 accent-teal-600'
                                    />
                                    <span className='capitalize'>{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Amenities */}
                    <div>
                        <label className='block text-sm font-medium mb-2'>Amenities</label>
                        <div className='flex gap-4 flex-wrap'>
                            {['parking', 'furnished'].map((amenity) => (
                                <label key={amenity} className='flex items-center gap-2 text-sm'>
                                    <input
                                        type='checkbox'
                                        id={amenity}
                                        className='w-4 h-4 accent-purple-600'
                                        onChange={handleChange}
                                        checked={!!sidebardata[amenity]}
                                    />
                                    <span className='capitalize'>{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>



                    {/* Offer */}
                    <label className='flex items-center gap-2 text-sm font-semibold'>
                        <input
                            type='checkbox'
                            id='offer'
                            className='w-4 h-4 accent-yellow-600'
                            onChange={handleChange}
                            checked={!!sidebardata.offer}
                        />
                        Offer
                    </label>

                    {/* Sort */}
                    <div>
                        <label className='block text-sm font-medium mb-1'>Sort by</label>
                        <select
                            id='sort_order'
                            onChange={handleChange}
                            value={`${sidebardata.sort}_${sidebardata.order}`}
                            className='w-full border rounded-lg p-3'
                        >
                            <option value='regularPrice_desc'>Price: High to Low</option>
                            <option value='regularPrice_asc'>Price: Low to High</option>
                            <option value='createdAt_desc'>Latest</option>
                            <option value='createdAt_asc'>Oldest</option>
                        </select>
                    </div>

                    <button
                        type='submit'
                        className='w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold'
                    >
                        Apply Filters
                    </button>
                </form>
            </aside>

            {/* Listings */}
            <main className='flex-1 p-6'>
                <h1 className='text-3xl font-bold text-slate-800 mb-6'>Listing Results</h1>
                <div className='flex flex-wrap gap-6 justify-center md:justify-start'>
                    {!loading && listings.length === 0 && (
                        <p className='text-xl text-gray-500 font-medium'>No listings found!</p>
                    )}
                    {loading && (
                        <p className='text-xl text-gray-500 text-center w-full'>Loading...</p>
                    )}
                    {!loading &&
                        listings.map((listing) => (
                            <ListingItem key={listing._id} listing={listing} />
                        ))}
                </div>
                {showMore && (
                    <div className='mt-8 flex justify-center'>
                        <button
                            onClick={onShowMoreClick}
                            className='text-blue-600 hover:underline text-lg font-medium'
                        >
                            Show more
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
