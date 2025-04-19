import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Sliders, Wifi, UtensilsCrossed, Dumbbell, Pencil, DollarSign, Bed, Bath, Home, MapPin, ArrowUpDown } from 'lucide-react';
import homepageImage from '../../images/homepage.png';
import apartment2Image from '../../images/apartment_2.webp';
import apartment3Image from '../../images/apartment_3.jpg';
import condo1Image from '../../images/condo_1.jpg';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import GoogleMapComponent from './GoogleMap';
import CitySearchAutocomplete from '../Common/CitySearchAutocomplete';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { debounce } from '../../utils/helpers';
import { formatDate } from '../../utils/dateUtils';

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
        {(!bids || bids.length === 0) && (
          <tr>
            <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
              No bids yet
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const ListingCard = ({ listing, setModalState, navigate, user }) => {
  const [isAuctionOpen, setIsAuctionOpen] = useState(false);
  const [bids, setBids] = useState([]);

  const fetchBids = async () => {
    try {
      const response = await api.get(`/properties/${listing.id}`);
      setBids(response.data.bids || []);
    } catch (error) {
      console.error('Error fetching bids:', error);
      setBids([]);
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

  return (
    <div className="max-w-[1400px] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/listings/${listing.id}`} className="block">
        <div className="relative h-48">
          <img 
            src={listing.images?.[0]?.image_url || '/placeholder.jpg'} 
            alt={listing.title} 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = '/placeholder.jpg'; }}
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
        </div>
        
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

        <div className="flex-1">
          <p className="text-gray-600 mb-1">
            <strong> Auction ends {new Date(listing.auction_end_date).toLocaleDateString()}</strong>
          </p>
        </div>

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
  const [bidError, setBidError] = useState(null);
  const location = useLocation();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    bedrooms: 0,
    bathrooms: 0,
    propertyType: '',
    amenities: [],
    radius: 10,
    sortBy: 'relevance'
  });
  const [modalState, setModalState] = useState({
    bid: { isOpen: false, listing: null },
    priceRange: { isOpen: false },
    propertyType: { isOpen: false },
    amenities: { isOpen: false },
    radius: { isOpen: false }
  });
  const [searchInput, setSearchInput] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const [mapCenter, setMapCenter] = useState(null);
  const mapRef = useRef(null);
  const [bidData, setBidData] = useState({
    amount: '',
    startDate: '',
    endDate: ''
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const closeModal = (modalName) => {
    setModalState(prev => ({ ...prev, [modalName]: { isOpen: false, listing: null } }));
    setBidData({ amount: '', startDate: '', endDate: '' });
    setBidError(null);
  };

  const submitBid = async () => {
    setBidError(null);
    
    if (!user) {
      navigate('/login');
      return;
    }
  
    // Validate amount
    if (!bidData.amount || isNaN(parseInt(bidData.amount)) || parseInt(bidData.amount) <= 0) {
      setBidError('Please enter a valid bid amount');
      return;
    }
    
    // Validate dates
    if (!bidData.startDate || !bidData.endDate) {
      setBidError('Please select both start and end dates');
      return;
    }
  
    const startDate = new Date(bidData.startDate);
    const endDate = new Date(bidData.endDate);
  
    if (startDate >= endDate) {
      setBidError('End date must be after start date');
      return;
    }
  
    try {
      const response = await api.post(`/bids/properties/${modalState.bid.listing.id}/bids`, {
        amount: parseInt(bidData.amount),
        start_date: bidData.startDate,
        end_date: bidData.endDate
      });
      
      closeModal('bid');
      fetchListings();
    } catch (error) {
      console.error('Error placing bid:', error);
      setBidError('Failed to place bid: ' + (error.response?.data?.error || error.message));
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const startDateParam = params.get('start_date');
    const endDateParam = params.get('end_date');
  
    if (startDateParam) setStartDate(startDateParam);
    if (endDateParam) setEndDate(endDateParam);
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lat = params.get('lat');
    const lng = params.get('lng');
    const address = params.get('address');
    
    if (lat && lng) {
      setMapCenter({ lat: parseFloat(lat), lng: parseFloat(lng) });
      setSearchLocation(address || '');
    }
  }, []);

  const fetchListings = async () => {
    if (!mapCenter) return;
  
    setLoading(true);
    try {
      const params = new URLSearchParams({
        latitude: mapCenter.lat,
        longitude: mapCenter.lng,
        radius: filters.radius || 10
      });

      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
  
      if (filters.priceRange[0] > 0) params.append('min_price', filters.priceRange[0]);
      if (filters.priceRange[1] < 5000) params.append('max_price', filters.priceRange[1]);
      if (filters.bedrooms > 0) params.append('bedrooms', filters.bedrooms);
      if (filters.bathrooms > 0) params.append('bathrooms', filters.bathrooms);
      if (filters.propertyType) params.append('type', filters.propertyType);
      filters.amenities.forEach((amenity) => {
        params.append('amenities', amenity);
      });

      const response = await api.get(`/search?${params.toString()}`);
      let fetchedListings = response.data.properties;

      // First apply price range filter
      fetchedListings = fetchedListings.filter(listing => {
        const price = listing.min_price || 0;
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });

      // Then apply sorting if selected
      if (filters.sortBy === 'price_asc') {
        fetchedListings.sort((a, b) => (a.min_price || 0) - (b.min_price || 0));
      } else if (filters.sortBy === 'price_desc') {
        fetchedListings.sort((a, b) => (b.min_price || 0) - (a.min_price || 0));
      }

      setListings(fetchedListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
};

  // Use debounce for the fetchListings function
  const debouncedFetchListings = useCallback(
    debounce(() => {
      fetchListings();
    }, 500),
    [mapCenter, filters, startDate, endDate]
  );

  useEffect(() => {
    if (mapCenter) {
      debouncedFetchListings();
    }
  }, [mapCenter, filters, startDate, endDate, debouncedFetchListings]);

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
          <div className="flex items-center flex-grow space-x-2">
            <CitySearchAutocomplete
              onLocationSelect={handleLocationSelect}
              placeholder="Enter a location..."
              initialValue={searchLocation}
            />
          </div>

          <div className="w-px h-8 bg-gray-200 mx-4"></div>

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
              <span className="text-gray-600 text-sm">To:</span><input
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
        {/* <FilterButton  
          icon={Home} 
          label={filters.propertyType || "Property Type"} 
          onClick={() => setModalState(prev => ({ ...prev, propertyType: { isOpen: true } }))} 
          active={filters.propertyType !== ''}
        /> */}
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
            // Removed relevance since we'll handle sorting client-side
            const sortOptions = ['price_asc', 'price_desc'];
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
        
        {bidError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {bidError}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Bid:</label>
            <input
              type="number"
              value={bidData.amount}
              onChange={(e) => setBidData(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full p-2 border rounded"
              placeholder="Enter bid amount"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date:</label>
            <input
              type="date"
              value={bidData.startDate}
              onChange={(e) => setBidData(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full p-2 border rounded"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date:</label>
            <input
              type="date"
              value={bidData.endDate}
              onChange={(e) => setBidData(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full p-2 border rounded"
              min={bidData.startDate || new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bid Competitiveness:</label>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{
                  width: `${Math.min(100, (parseInt(bidData.amount) / modalState.bid.listing?.min_price) * 100)}%`
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
        </div>
      </Modal>

      <Modal
  isOpen={modalState.priceRange.isOpen}
  onClose={() => closeModal('priceRange')}
  title="Price Range"
>
  <div className="mb-4 px-4">
    <div className="relative pt-6 pb-2">
      <div className="absolute h-1 w-full bg-gray-200 rounded">
        <div
          className="absolute h-1 bg-blue-500 rounded"
          style={{
            left: `${(filters.priceRange[0] / 5000) * 100}%`,
            right: `${100 - (filters.priceRange[1] / 5000) * 100}%`
          }}
        />
      </div>
      
      {/* Min Range Input */}
      <input
        type="range"
        min={0}
        max={5000}
        step={100}
        value={filters.priceRange[0]}
        onChange={(e) => {
          const value = Math.min(parseInt(e.target.value), filters.priceRange[1] - 100);
          handleFilterChange('priceRange', [value, filters.priceRange[1]]);
        }}
        className="absolute w-full top-0 h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-blue-500 [&::-webkit-slider-thumb]:ring-offset-2 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:ring-2 [&::-moz-range-thumb]:ring-blue-500 [&::-moz-range-thumb]:ring-offset-2"
      />
      
      {/* Max Range Input */}
      <input
        type="range"
        min={0}
        max={5000}
        step={100}
        value={filters.priceRange[1]}
        onChange={(e) => {
          const value = Math.max(parseInt(e.target.value), filters.priceRange[0] + 100);
          handleFilterChange('priceRange', [filters.priceRange[0], value]);
        }}
        className="absolute w-full top-0 h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-blue-500 [&::-webkit-slider-thumb]:ring-offset-2 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:ring-2 [&::-moz-range-thumb]:ring-blue-500 [&::-moz-range-thumb]:ring-offset-2"
      />
    </div>
    
    <div className="flex justify-between items-end mt-8">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Min Price</label>
        <input
          type="number"
          value={filters.priceRange[0]}
          onChange={(e) => {
            const value = Math.min(parseInt(e.target.value) || 0, filters.priceRange[1] - 100);
            handleFilterChange('priceRange', [value, filters.priceRange[1]]);
          }}
          className="w-24 p-2 border rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <span className="text-gray-500 mb-2">to</span>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Max Price</label>
        <input
          type="number"
          value={filters.priceRange[1]}
          onChange={(e) => {
            const value = Math.max(parseInt(e.target.value) || 0, filters.priceRange[0] + 100);
            handleFilterChange('priceRange', [filters.priceRange[0], value]);
          }}
          className="w-24 p-2 border rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    <div className="mt-6">
      <div className="text-sm text-gray-600 mb-2">Quick Select:</div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Under $1000", values: [0, 1000] },
          { label: "$1000-$2000", values: [1000, 2000] },
          { label: "$2000-$3000", values: [2000, 3000] },
          { label: "$3000+", values: [3000, 5000] }
        ].map(({ label, values }) => (
          <button
            key={label}
            onClick={() => handleFilterChange('priceRange', values)}
            className={`px-3 py-2 text-sm rounded-full border transition-colors
              ${filters.priceRange[0] === values[0] && filters.priceRange[1] === values[1]
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
              }`}
          >
            {label}
          </button>
        ))}
      </div>
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
      <div className="h-64 overflow-y-auto space-y-6">
        {/* Main Amenities */}
        <div>
          <h3 className="text-lg font-bold mb-2">Main Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Wifi" },
              { label: "TV" },
              { label: "Kitchen" },
              { label: "Washer" },
              { label: "Free parking on premises" },
              { label: "Paid parking on premises" },
              { label: "Air conditioning" },
              { label: "Study spaces" },
            ].map((amenity) => (
              <button
                key={amenity.label}
                className={`w-full text-center px-4 py-2 rounded ${
                  filters.amenities.includes(amenity.label)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
                onClick={() =>
                  handleFilterChange(
                    'amenities',
                    filters.amenities.includes(amenity.label)
                      ? filters.amenities.filter((a) => a !== amenity.label)
                      : [...filters.amenities, amenity.label]
                  )
                }
              >
                {amenity.label}
              </button>
            ))}
          </div>
        </div>

        {/* Extra Amenities */}
        <div>
          <h3 className="text-lg font-bold mb-2">Extra Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Pool" },
              { label: "Hot tub" },
              { label: "BBQ grill" },
              { label: "Pool table" },
              { label: "Piano" },
              { label: "Exercise equipment/gym" },
            ].map((amenity) => (
              <button
                key={amenity.label}
                className={`w-full text-center px-4 py-2 rounded ${
                  filters.amenities.includes(amenity.label)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
                onClick={() =>
                  handleFilterChange(
                    'amenities',
                    filters.amenities.includes(amenity.label)
                      ? filters.amenities.filter((a) => a !== amenity.label)
                      : [...filters.amenities, amenity.label]
                  )
                }
              >
                {amenity.label}
              </button>
            ))}
          </div>
        </div>

        {/* Safety Items */}
        <div>
          <h3 className="text-lg font-bold mb-2">Safety Items</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Smoke alarm" },
              { label: "First aid kit" },
              { label: "Fire extinguisher" },
              { label: "Carbon monoxide alarm" },
            ].map((amenity) => (
              <button
                key={amenity.label}
                className={`w-full text-center px-4 py-2 rounded ${
                  filters.amenities.includes(amenity.label)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
                onClick={() =>
                  handleFilterChange(
                    'amenities',
                    filters.amenities.includes(amenity.label)
                      ? filters.amenities.filter((a) => a !== amenity.label)
                      : [...filters.amenities, amenity.label]
                  )
                }
              >
                {amenity.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>


    </div>
  );
} 