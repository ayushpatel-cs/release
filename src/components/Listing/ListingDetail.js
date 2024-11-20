'use client'

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BedDouble,
  Bath,
  MapPin,
  Calendar as CalendarIcon,
  CheckCircle,
} from 'lucide-react';
import api from '../../utils/api';

export default function ListingDetail() {
  const [listing, setListing] = useState(null);
  const [user, setUser] = useState(null); // New state for user data
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        // Fetch the listing data
        const response = await api.get(`/properties/${id}`);
        const listingData = response.data;
        setListing(listingData);
        setBidAmount(listingData.min_price?.toString() || '');

        // Fetch the user data using user_id from the listing
        const userResponse = await api.get(`/users/${listingData.user_id}`);
        setUser(userResponse.data);
      } catch (error) {
        console.error('Error fetching listing or user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  // Update countdown timer
  useEffect(() => {
    if (!listing?.auction_end_date) return;

    const updateTimer = () => {
      const now = new Date();
      const end = new Date(listing.auction_end_date);
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Auction ended');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [listing?.auction_end_date]);

  const handleBid = async () => {
    try {
      if (!startDate || !endDate) {
        alert('Please select both start and end dates');
        return;
      }
  
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      if (start >= end) {
        alert('End date must be after start date');
        return;
      }

      console.log(startDate)
      console.log(endDate)
  
      await api.post(`/bids/properties/${id}/bids`, {
        amount: parseInt(bidAmount),
        start_date: startDate,
        end_date: endDate
      });
  
      // Show success message
      alert('Bid placed successfully!');
  
      // Refresh listing data
      const response = await api.get(`/properties/${id}`);
      const listingData = response.data;
      setListing(listingData);
  
      // Refresh user data in case it changed
      const userResponse = await api.get(`/users/${listingData.user_id}`);
      setUser(userResponse.data);
    } catch (error) {
      console.error('Error placing bid:', error);
      alert('Failed to place bid: ' + (error.response?.data?.error || error.message));
    }
  };

  const isAuctionEnded = () => {
    if (!listing?.auction_end_date) return false;
    return new Date(listing.auction_end_date) <= new Date();
  };

  // Calculate bid competitiveness
  const getBidCompetitiveness = () => {
    if (!bidAmount || !listing?.min_price) return 0;
    return Math.min(100, (parseInt(bidAmount) / listing.min_price) * 100);
  };

  // BidHistory component
  const BidHistory = ({ bids }) => (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Bid History</h3>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Bidder
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                End Date
              </th>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(bid.start_date).toLocaleDateString('en-US', {
                    timeZone: 'UTC', 
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(bid.end_date).toLocaleDateString('en-US', {
                    timeZone: 'UTC', 
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Amenities component
  const Amenities = ({ amenities }) => (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Amenities</h3>
      <ul className="grid grid-cols-2 gap-4">
        {amenities?.map((amenity, index) => (
          <li key={index} className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            {amenity}
          </li>
        ))}
      </ul>
    </div>
  );

  if (loading)
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );

  if (!listing)
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-xl">Listing not found</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <h1 className="text-2xl font-semibold mb-2">{listing.title}</h1>
        <div className="flex items-center text-gray-600 mb-6">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{listing.formatted_address}</span>
        </div>

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
                    (currentImageIndex - 1 + listing.images.length) %
                      listing.images.length
                  )
                }
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-5xl font-bold"
              >
                &lsaquo;
              </button>
              {/* Next button */}
              <button
                onClick={() =>
                  setCurrentImageIndex(
                    (currentImageIndex + 1) % listing.images.length
                  )
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
            {/* Property Info */}
            <section className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1">
                  Entire {listing.type} hosted by {user?.name || 'Host'}
                </h2>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center">
                    <BedDouble className="w-5 h-5 mr-1" />
                    <span>{listing.bedrooms} bedrooms</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-5 h-5 mr-1" />
                    <span>{listing.bathrooms} bathrooms</span>
                  </div>
                </div>
                {/* First Available and Last Available Dates */}
                <div className="mt-2 text-gray-600">
                  <div>
                    <CalendarIcon className="inline-block w-5 h-5 mr-1" />
                    Available from{' '}
                    {new Date(listing.start_date).toLocaleDateString()} to{' '}
                    {new Date(listing.end_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {/* Owner Avatar */}
              <div>
                <img
                  src={user?.profile_image_url || '/default-avatar.png'}
                  alt={user?.name || 'Host'}
                  className="w-16 h-16 rounded-full"
                />
              </div>
            </section>

            {/* Description */}
            <section>
              <h2 className="text-xl font-semibold mb-4">About this property</h2>
              <p className="text-gray-600 whitespace-pre-line">
                {listing.description}
              </p>
            </section>

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <Amenities amenities={listing.amenities} />
            )}

            {/* Location */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div className="aspect-[2/1] relative rounded-lg overflow-hidden bg-gray-200">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
                    listing.formatted_address
                  )}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0"
                />
              </div>
              <p className="mt-4 text-gray-600">{listing.formatted_address}</p>
            </section>

            {/* Bid History */}
            {listing.bids && listing.bids.length > 0 && (
              <BidHistory bids={listing.bids} />
            )}
          </div>

          {/* Right Column - Bid Box */}
          <div className="col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-lg sticky top-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold">
                  ${listing.min_price.toLocaleString()}
                </h3>
                <p className="text-gray-600">Starting price</p>
              </div>

              {/* Auction Timer */}
              <div className="mb-6">
                <div
                  className={`p-4 rounded-lg ${
                    isAuctionEnded() ? 'bg-red-100' : 'bg-green-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    <span className="font-medium">
                      Auction {isAuctionEnded() ? 'ended' : 'ends in'}:
                    </span>
                  </div>
                  <div className="mt-2">
                    {isAuctionEnded() ? (
                      <span className="text-red-600 font-bold">
                        Auction has ended
                      </span>
                    ) : (
                      <>
                        <div className="text-lg font-bold text-green-600">
                          {timeLeft}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Ends on{' '}
                          {new Date(
                            listing.auction_end_date
                          ).toLocaleString()}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

                        {!isAuctionEnded() && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your bid amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border rounded-lg"
                    min={listing.min_price}
                  />
                </div>
                
                {/* Bid competitiveness indicator */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bid Competitiveness:
                  </label>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${getBidCompetitiveness()}%` }}
                    />
                  </div>
                </div>

                {/* Date Selection */}
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      min={startDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleBid}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Place Bid
              </button>
            </>
          )}

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
