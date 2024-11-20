'use client'

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Info, Ban, Calendar } from 'lucide-react';
import api from '../../utils/api';

export default function ListingDetail() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  // New state variables for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/properties/${id}`);
        setListing(response.data);
        setBidAmount(response.data.min_price?.toString() || '');
      } catch (error) {
        console.error('Error fetching listing:', error);
        setError('Failed to fetch listing details');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleBid = async () => {
    try {
      await api.post(`/bids/properties/${id}/bids`, {
        amount: parseFloat(bidAmount)
      });
      // Refresh listing data after bid
      const response = await api.get(`/properties/${id}`);
      setListing(response.data);
    } catch (error) {
      console.error('Error placing bid:', error);
      alert('Failed to place bid');
    }
  };

  // Add a new BidHistory component
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
        {/* Header */}
        <h1 className="text-2xl font-semibold mb-6">{listing.title}</h1>

        {/* Image Gallery */}
        <div className="relative rounded-3xl overflow-hidden mb-6">
          <div className="grid grid-cols-4 grid-rows-2 gap-2">
            {/* Main Image */}
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
            {/* Thumbnails */}
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
          {/* View All Photos Button */}
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

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="relative max-w-5xl w-full mx-auto">
              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white text-3xl font-bold"
              >
                &times;
              </button>
              {/* Previous button */}
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
              {/* Next button */}
              <button
                onClick={() =>
                  setCurrentImageIndex((currentImageIndex + 1) % listing.images.length)
                }
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-5xl font-bold"
              >
                &rsaquo;
              </button>
              {/* Current image */}
              <img
                src={listing.images[currentImageIndex].image_url}
                alt={`Image ${currentImageIndex + 1}`}
                className="w-full max-h-screen object-contain rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-xl font-semibold mb-4">About this property</h2>
              <p className="text-gray-600">{listing.description}</p>
            </section>

            {/* Location */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div className="aspect-[2/1] relative rounded-lg overflow-hidden bg-gray-200">
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

            {/* Bid History */}
            <BidHistory bids={listing.bids} />
          </div>

          {/* Right Column - Bid Box */}
          <div className="col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-lg sticky top-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold">${listing.min_price.toLocaleString()}</h3>
                <p className="text-gray-600">Starting price</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your bid amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border rounded-lg"
                    min={listing.min_price}
                  />
                </div>
              </div>

              <button
                onClick={handleBid}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Place Bid
              </button>

              <div className="mt-4 text-sm text-gray-500">
                {listing.bids?.length || 0} bids so far
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
