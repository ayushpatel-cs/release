'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaBath, FaBed, FaCheckCircle} from 'react-icons/fa'; // Import the icons from react-icons
import api from '../../utils/api';

export default function SellerListingDetail() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/properties/${id}`);
        setListing(response.data);
      } catch (error) {
        console.error('Error fetching listing:', error);
        setError('Failed to fetch listing details');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const BidHistory = ({ bids }) => (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Bid History</h3>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bidder</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bids?.map((bid) => (
              <tr key={bid.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bid.bidder?.name || 'Anonymous'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${bid.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(bid.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>
  );

  if (!listing) return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
      <div className="text-xl">Listing not found</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <h1 className="text-2xl font-semibold mb-6">{listing.title}</h1>

        <div className="relative rounded-3xl overflow-hidden mb-6">
          <div className="grid grid-cols-4 grid-rows-2 gap-2">
            <div className="col-span-2 row-span-2">
              <img
                src={listing.images?.[0]?.image_url || '/placeholder.jpg'}
                alt={listing.title}
                className="w-full h-full object-cover cursor-pointer rounded-lg"
                onClick={() => {
                  setCurrentImageIndex(0);
                  setIsModalOpen(true);
                }}
              />
            </div>
            {listing.images?.slice(1, 5).map((image, index) => (
              <div key={image.id} className="relative">
                <img
                  src={image.image_url}
                  alt={`View ${index + 2}`}
                  className="w-full h-full object-cover cursor-pointer rounded-lg"
                  onClick={() => {
                    setCurrentImageIndex(index + 1);
                    setIsModalOpen(true);
                  }}
                />
                {index === 3 && listing.images.length > 5 && (
                  <button
                    onClick={() => {
                      setCurrentImageIndex(4);
                      setIsModalOpen(true);
                    }}
                    className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center text-lg font-semibold rounded-lg"
                  >
                    +{listing.images.length - 5} more
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setCurrentImageIndex(0);
                setIsModalOpen(true);
              }}
              className="inline-block bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900 transition-colors"
            >
              View all Photos
            </button>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="relative max-w-5xl w-full mx-auto">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white text-3xl font-bold"
              >
                &times;
              </button>
              <button
                onClick={() =>
                  setCurrentImageIndex(
                    (currentImageIndex - 1 + listing.images.length) % listing.images.length
                  )
                }
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-5xl font-bold"
              >
                &lsaquo;
              </button>
              <button
                onClick={() =>
                  setCurrentImageIndex((currentImageIndex + 1) % listing.images.length)
                }
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-5xl font-bold"
              >
                &rsaquo;
              </button>
              <img
                src={listing.images?.[currentImageIndex]?.image_url || '/placeholder.jpg'}
                alt={`Image ${currentImageIndex + 1}`}
                className="w-full max-h-screen object-contain rounded-lg"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-2">
            <section>
              <h2 className="text-xl font-semibold mb-4">About this property</h2>
              <p className="text-gray-600">{listing.description}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <FaBed className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="text-lg">{listing.bedrooms} bedrooms</span>
                </div>
                <div className="flex items-center">
                  <FaBath className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="text-lg">{listing.bathrooms} bathrooms</span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                {listing.amenities.map((amenity, index) => (
                  <li key={index} className="flex items-center">
                    <FaCheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    {amenity}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-gray-200">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(listing.address)}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0"
                />
              </div>
              <p className="mt-4 text-gray-600">{listing.address}</p>
            </section>
          </div>

          <div className="col-span-1">
            <BidHistory bids={listing.bids} />
          </div>
        </div>
      </div>
    </div>
  );
}