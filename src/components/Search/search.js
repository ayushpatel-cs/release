import React, { useState, useEffect, useRef } from 'react';
import { Search, Sliders, Wifi, UtensilsCrossed, Dumbbell, Pencil, DollarSign, Bed, Bath, Home, Info, MapPin, ArrowUpDown } from 'lucide-react';
import homepageImage from '../../images/homepage.png';
import apartment2Image from '../../images/apartment_2.webp';
import apartment3Image from '../../images/apartment_3.jpg';
import condo1Image from '../../images/condo_1.jpg';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import GoogleMapComponent from './GoogleMap';
import CitySearchAutocomplete from '../Common/CitySearchAutocomplete';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const images = [homepageImage, apartment2Image, apartment3Image, condo1Image];

const FilterButton = ({ icon: Icon, label, onClick, active }) => (
  <button 
    className={`px-4 py-2 bg-white text-gray-700 rounded-full shadow-sm hover:shadow-md transition-shadow border-2 ${active ? 'border-blue-500' : 'border-gray-200'} flex items-center whitespace-nowrap`}
    onClick={onClick}
  >
    <Icon className="h-4 w-4 mr-2" /> {label}
  </button>
);

const AuctionTable = ({ bids }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bidder</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {bids.map((bid, index) => (
          <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Anonymous {bid.id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${bid.amount}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bid.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ListingCard = ({ listing, setModalState, navigate, user }) => {
  const [isAuctionOpen, setIsAuctionOpen] = useState(false);
  const [bids, setBids] = useState([]);

  const fetchBids = async () => {
    try {
      const response = await api.get(`/properties/${listing.id}/bids`);
      setBids(response.data.bids);
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
  };

  useEffect(() => {
    if (isAuctionOpen) {
      fetchBids();
    }
  }, [isAuctionOpen, listing.id]);

  const handleBid = (listing) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setModalState(prev => ({ 
      ...prev, 
      bid: { isOpen: true, listing } 
    }));
  };

  const handleInfo = () => {
    setModalState(prev => ({ 
      ...prev, 
      info: { isOpen: true, listing } 
    }));
  };

  return (
    <div className="max-w-[1400px] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/listings/${listing.id}`} className="block">
        <div className="relative h-48">
          <img 
            src={listing.images?.[0]?.image_url || '/placeholder.jpg'} 
            alt={listing.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h3 className="text-xl font-semibold text-white">{listing.title}</h3>
          </div>
        </div>
      </Link>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <p className="text-sm text-gray-600">
            {listing.bedrooms} beds · {listing.bathrooms} bath · {listing.type}
          </p>
          <button onClick={() => handleInfo(listing)} className="text-blue-500 hover:text-blue-600">
            <Info className="h-5 w-5" />
          </button>
        </div>
        
        {/* Add features/amenities display */}
        <div className="flex flex-wrap gap-3 mb-3">
          {listing.amenities?.map((amenity, index) => (
            <span key={index} className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {amenity}
            </span>
          ))}
        </div>

        <p className="text-gray-600 mb-2">{listing.address}</p>
        <p className="font-semibold text-2xl text-[#6B7FF0] mb-4">
          ${listing.min_price?.toLocaleString()} <span className="font-normal text-gray-600 text-base">/month</span>
        </p>

        {/* Add bidding buttons */}
        <button 
          onClick={() => handleBid(listing)}
          className="w-full bg-[#6B7FF0] text-white py-2 rounded-lg hover:bg-[#5A6FE0] transition-colors mb-4"
        >
          Place Bid
        </button>
        <button 
          onClick={() => setIsAuctionOpen(!isAuctionOpen)}
          className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          {isAuctionOpen ? 'Close Auction' : 'View Auction'}
        </button>

        {/* Show auction table when open */}
        {isAuctionOpen && (
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2">Current Auction</h4>
            <AuctionTable bids={bids} />
          </div>
        )}
      </div>
    </div>
  );
};

const MapView = ({ listings, center, zoom, radius }) => {
  return (
    <div className="col-span-3 bg-white rounded-2xl h-[calc(100vh-240px)] overflow-hidden shadow-lg">
      <GoogleMapComponent 
        listings={listings}
        center={center}
        zoom={zoom}
        radius={radius}
      />
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full mx-auto p-6">
        <h3 className="text-lg font-medium mb-4">{title}</h3>
        {children}
        <button onClick={onClose} className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
          Close
        </button>
      </div>
    </div>
  );
};

export default function ImprovedSearchInterface() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    bedrooms: 0,
    bathrooms: 0,
    propertyType: '',
    amenities: [],
    radius: 1, // in miles
    sortBy: 'relevance' // 'price_asc', 'price_desc', or 'relevance'
  });
  const [modalState, setModalState] = useState({
    bid: { isOpen: false, listing: null },
    info: { isOpen: false, listing: null },
    priceRange: { isOpen: false },
    propertyType: { isOpen: false },
    amenities: { isOpen: false },
    radius: { isOpen: false }
  });
  const [searchInput, setSearchInput] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [mapCenter, setMapCenter] = useState(null);
  const mapRef = useRef(null);
  const [bidAmount, setBidAmount] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  
  const closeModal = (modalName) => {
    setModalState(prev => ({ ...prev, [modalName]: { isOpen: false, listing: null } }));
  };

  const submitBid = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await api.post(`/bids/properties/${modalState.bid.listing.id}/bids`, {
        amount: parseInt(bidAmount)
      });
      
      // Show success message
      alert('Bid placed successfully!');
      
      closeModal('bid');
      setBidAmount('');
      
      // Refresh listings to show updated bid information
      fetchListings();
    } catch (error) {
      console.error('Error placing bid:', error);
      alert('Failed to place bid: ' + (error.response?.data?.error || error.message));
    }
  };

  useEffect(() => {
    // Get search params from URL
    const params = new URLSearchParams(window.location.search);
    const lat = params.get('lat');
    const lng = params.get('lng');
    const address = params.get('address');
    
    if (lat && lng) {
      setMapCenter({ lat: parseFloat(lat), lng: parseFloat(lng) });
      setSearchLocation(address || '');
    }
  }, []);

  // Move fetchListings outside useEffect and make it reusable
  const fetchListings = async () => {
    if (!mapCenter) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        latitude: mapCenter.lat,
        longitude: mapCenter.lng,
        radius: filters.radius || 10
      });

      if (filters.priceRange[0] > 0) params.append('min_price', filters.priceRange[0]);
      if (filters.priceRange[1] < 5000) params.append('max_price', filters.priceRange[1]);
      if (filters.bedrooms > 0) params.append('bedrooms', filters.bedrooms);
      if (filters.bathrooms > 0) params.append('bathrooms', filters.bathrooms);
      if (filters.propertyType) params.append('type', filters.propertyType);

      const response = await api.get(`/search?${params.toString()}`);
      setListings(response.data.properties);
      return response.data.properties; // Return the listings for reuse
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError('Failed to fetch listings');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Update the useEffect to use the fetchListings function
  useEffect(() => {
    fetchListings();
  }, [mapCenter, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [filterName]: value }));
  };

  const handleSearchInputChange = (value) => {
    setSearchInput(value);
    setSearchLocation(value);
  };
  

  const handleLocationSelect = (data) => {
    setMapCenter({
      lat: data.latitude,
      lng: data.longitude
    });
    
    // Use the viewport bounds from Google Places API for better search results
    if (data.viewport && mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(data.viewport.south, data.viewport.west),
        new window.google.maps.LatLng(data.viewport.north, data.viewport.east)
      );
      mapRef.current.fitBounds(bounds);
    }
  };

  return (
    <div className="max-w-[2400px] mx-auto p-6 font-sans bg-[#FFF8F0] min-h-screen">
      <div className="flex items-center space-x-2 mb-8">
      <div className="flex-grow flex items-center bg-white rounded-full p-2 shadow-md border border-gray-200">
        {/* Left side: Location Input */}
        <div className="flex items-center flex-grow space-x-2">
          <CitySearchAutocomplete
            onLocationSelect={handleLocationSelect}
            placeholder="Enter a location..."
            initialValue={searchLocation}
          />
        </div>

        {/* Vertical line separator */}
        <div className="w-px h-8 bg-gray-200 mx-4"></div>

        {/* Right side: From Date, To Date, and Search Button */}
        <div className="flex items-center space-x-4 ml-auto">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 text-sm">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-40 border-none bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 text-lg px-4 py-2"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 text-sm">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-40 border-none bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 text-lg px-4 py-2"
            />
          </div>
          <button className="bg-[#6B7FF0] text-white p-2 rounded-full hover:bg-[#5A6FE0] transition-colors">
            <Search className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
      
      <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
        <FilterButton 
          icon={DollarSign} 
          label={`${filters.priceRange[0]} - ${filters.priceRange[1]}`} 
          onClick={() => setModalState(prev => ({ ...prev, priceRange: { isOpen: true } }))} 
          active={filters.priceRange[0] !== 0 || filters.priceRange[1] !== 5000}
        />
        <FilterButton 
          icon={MapPin} 
          label={`Within ${filters.radius} miles`} 
          onClick={() => setModalState(prev => ({ ...prev, radius: { isOpen: true } }))} 
          active={filters.radius !== 1}
        />
        <FilterButton 
          icon={Bed} 
          label={`${filters.bedrooms}+ Beds`} 
          onClick={() => handleFilterChange('bedrooms', (filters.bedrooms + 1) % 4)} 
          active={filters.bedrooms > 0}
        />
        <FilterButton 
          icon={Bath} 
          label={`${filters.bathrooms}+ Baths`} 
          onClick={() => handleFilterChange('bathrooms', (filters.bathrooms + 1) % 4)} 
          active={filters.bathrooms > 0}
        />
        <FilterButton  
          icon={Home} 
          label={filters.propertyType || "Property Type"} 
          onClick={() => setModalState(prev => ({ ...prev, propertyType: { isOpen: true } }))} 
          active={filters.propertyType !== ''}
        />
        <FilterButton 
          icon={Wifi} 
          label={`Amenities (${filters.amenities.length})`} 
          onClick={() => setModalState(prev => ({ ...prev, amenities: { isOpen: true } }))} 
          active={filters.amenities.length > 0}
        />
        <FilterButton 
          icon={ArrowUpDown} 
          label={filters.sortBy === 'price_asc' ? 'Price: Low to High' : filters.sortBy === 'price_desc' ? 'Price: High to Low' : 'Relevance'} 
          onClick={() => {
            const sortOptions = ['relevance', 'price_asc', 'price_desc'];
            const currentIndex = sortOptions.indexOf(filters.sortBy);
            const nextIndex = (currentIndex + 1) % sortOptions.length;
            handleFilterChange('sortBy', sortOptions[nextIndex]);
          }} 
          active={filters.sortBy !== 'relevance'}
        />
      </div>
        
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-3 bg-white rounded-2xl h-[calc(100vh-240px)] overflow-hidden shadow-lg">
          <MapView 
            listings={listings}
            center={mapCenter || { lat: 39.8283, lng: -98.5795 }}
            zoom={mapCenter ? 13 : 4}
            radius={filters.radius}
          />
        </div>
        <div className="col-span-2 space-y-6 overflow-y-auto h-[calc(100vh-240px)] pr-4">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <>
              <div className="text-xl text-gray-800 font-semibold">
                {listings.length} properties found
              </div>
              {listings.map((listing) => (
                <ListingCard 
                  key={listing.id} 
                  listing={listing}
                  setModalState={setModalState}
                  navigate={navigate}
                  user={user}
                />
              ))}
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalState.bid.isOpen}
        onClose={() => closeModal('bid')}
        title="Place a Bid"
      >
        <p className="mb-4">Current price: ${modalState.bid.listing?.min_price}/month</p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Bid:</label>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Bid Competitiveness:</label>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{
                width: `${Math.min(100, (parseInt(bidAmount) / modalState.bid.listing?.min_price) * 100)}%`
              }}
            />
          </div>
        </div>
        <button 
          onClick={submitBid} 
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit Bid
        </button>
      </Modal>

      <Modal
        isOpen={modalState.info.isOpen}
        onClose={() => closeModal('info')}
        title={modalState.info.listing?.name}
      >
        <p className="mb-4">{modalState.info.listing?.description}</p>
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Details:</h4>
          <ul className="list-disc list-inside">
            <li>{modalState.info.listing?.beds} Bedrooms</li>
            <li>{modalState.info.listing?.baths} Bathrooms</li>
            <li>Type: {modalState.info.listing?.type}</li>
            <li>Floor: {modalState.info.listing?.floor}</li>
            <li>Price: ${modalState.info.listing?.price}/month</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Features:</h4>
          <div className="flex flex-wrap gap-2">
            {modalState.info.listing?.features.map((feature, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modalState.priceRange.isOpen}
        onClose={() => closeModal('priceRange')}
        title="Price Range"
      >
        <div className="mb-4">
          <input
            type="range"
            min={0}
            max={5000}
            step={100}
            value={filters.priceRange[1]}
            onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
            className="w-full"
          />
          <div className="flex justify-between items-center mt-2">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
              className="w-24 p-2 border rounded text-center"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
              className="w-24 p-2 border rounded text-center"
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modalState.radius.isOpen}
        onClose={() => closeModal('radius')}
        title="Distance from center"
      >
        <div className="mb-4">
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={filters.radius}
            onChange={(e) => handleFilterChange('radius', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-500">1 mile</span>
            <input
              type="number"
              value={filters.radius}
              onChange={(e) => handleFilterChange('radius', parseInt(e.target.value))}
              className="w-24 p-2 border rounded text-center"
            />
            <span className="text-gray-500">20 miles</span>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modalState.propertyType.isOpen}
        onClose={() => closeModal('propertyType')}
        title="Property Type"
      >
        <div className="space-y-2">
          {['Apartment', 'Studio', 'Condo', 'House'].map((type) => (
            <button
              key={type}
              className={`w-full text-left px-4 py-2 rounded ${filters.propertyType === type ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => handleFilterChange('propertyType', type)}
            >
              {type}
            </button>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={modalState.amenities.isOpen}
        onClose={() => closeModal('amenities')}
        title="Amenities"
      >
        <div className="space-y-2">
          {['Wifi', 'Kitchen', 'Gym', 'Study Areas', 'Laundry', 'Pool'].map((amenity) => (
            <button
              key={amenity}
              className={`w-full text-left px-4 py-2 rounded ${filters.amenities.includes(amenity) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => handleFilterChange('amenities', 
                filters.amenities.includes(amenity) 
                  ? filters.amenities.filter(a => a !== amenity)
                  : [...filters.amenities, amenity]
              )}
            >
              {amenity}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}