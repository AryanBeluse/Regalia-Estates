import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({ listing }) {

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
        <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
            <Link to={`/listing/${listing._id}`}>
                <img
                    src={
                        listing.imageUrls[0] ||
                        'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
                    }
                    alt='listing cover'
                    className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
                />
                <div className='p-3 flex flex-col gap-2 w-full'>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p
                            className="text-lg font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition"
                            onClick={() => navigate(`/listing/${listing._id}`)}
                        >
                            {listing?.LisName || "No Title"}
                        </p>
                        {listing.verified && (
                            <span
                                className="text-blue-600 font-medium bg-blue-100 gap-1 px-2 py-0.5 rounded-full text-xs cursor-pointer"
                                title="Verified by Regalia Estates"
                            >
                                Verified
                            </span>
                        )}
                    </div>
                    <div className='flex items-center gap-1'>
                        <MdLocationOn className='h-4 w-4  text-green-700' />
                        <p className='text-xs text-gray-600 truncate w-full mb-1'>
                            {listing.address.propertyName}, {listing.address.city}, {listing.address.state}, {listing.address.country}
                        </p>

                    </div>
                    <p className='text-sm text-gray-600 line-clamp-2'>
                        {listing.description}
                    </p>
                    <div className="flex items-center gap-6 mt-1">

                        <p className="text-md font-semibold">
                            ₹
                            {listing?.features?.sell
                                ? formatIndianCurrency(listing.discountPrice || listing.regularPrice)
                                : listing?.features?.rent
                                    ? formatIndianCurrency(listing.regularPrice) + '/month'
                                    : formatIndianCurrency(listing.regularPrice || 0)}
                        </p>

                        <div className='flex gap-3'>
                            <span
                                className={`px-2 py-1 text-xs font-semibold text-white rounded ${listing?.features?.sell
                                    ? "bg-green-600"
                                    : listing?.features?.rent
                                        ? "bg-blue-600"
                                        : "bg-gray-600"
                                    }`}
                            >
                                {listing?.features?.sell
                                    ? "For Sale"
                                    : listing?.features?.rent
                                        ? "For Rent"
                                        : "N/A"}
                            </span>

                            <p className="px-2 py-1 text-xs font-semibold text-white rounded bg-indigo-700 ">
                                {listing.discountPrice && listing.regularPrice
                                    ? `${(((Number(listing.regularPrice) - Number(listing.discountPrice)) / Number(listing.regularPrice)) * 100).toFixed(0)}% off`
                                    : ''}
                            </p>
                        </div>

                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                        <p className="text-gray-500 text-xs">
                            Listed at: {listing.createdAt
                                ?.slice(0, 10)
                                .split("-")
                                .reverse()
                                .join("-") || "N/A"}
                        </p>

                    </div>

                </div>
            </Link>
        </div>
    );
}