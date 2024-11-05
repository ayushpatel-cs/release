import React, { useState, useEffect } from 'react';
import { Search, Sliders, Wifi, UtensilsCrossed, Dumbbell, Pencil, DollarSign, Bed, Bath, Home, Info, MapPin, ArrowUpDown } from 'lucide-react';
import homepageImage from '../../images/homepage.png';
import apartment2Image from '../../images/apartment_2.webp';
import apartment3Image from '../../images/apartment_3.jpg';
import condo1Image from '../../images/condo_1.jpg';

const images = [homepageImage, apartment2Image, apartment3Image, condo1Image];

const initialListings = [
  { 
    id: 1, 
    name: "Hub Atlanta", 
    beds: 2, 
    baths: 2, 
    type: "Apartment", 
    floor: 5, 
    price: 1850, 
    features: ["Wifi", "Kitchen", "Gym", "Study Areas"], 
    coordinates: [33.7756, -84.3963], 
    description: "Modern apartment complex with state-of-the-art amenities.",
    image: images[0],
    relevanceScore: 0.95
  },
  { 
    id: 2, 
    name: "The Mark Atlanta", 
    beds: 1, 
    baths: 1, 
    type: "Studio", 
    floor: 3, 
    price: 1200, 
    features: ["Wifi", "Kitchen", "Laundry"], 
    coordinates: [33.7816, -84.3891], 
    description: "Cozy studio apartments perfect for students and young professionals.",
    image: images[1],
    relevanceScore: 0.88
  },
  { 
    id: 3, 
    name: "Square on Fifth", 
    beds: 3, 
    baths: 2, 
    type: "Condo", 
    floor: 8, 
    price: 2400, 
    features: ["Wifi", "Kitchen", "Gym", "Pool"], 
    coordinates: [33.7771, -84.3889], 
    description: "Luxurious condos with panoramic views of the Atlanta skyline.",
    image: images[2],
    relevanceScore: 0.92
  },
  { 
    id: 4, 
    name: "University House", 
    beds: 4, 
    baths: 2, 
    type: "House", 
    floor: 2, 
    price: 3000, 
    features: ["Wifi", "Kitchen", "Backyard", "Parking"], 
    coordinates: [33.7807, -84.3879], 
    description: "Spacious house perfect for a group of students or young professionals.",
    image: images[3],
    relevanceScore: 0.85
  }
];

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

const ListingCard = ({ listing, onBid, onInfo }) => {
  const [isAuctionOpen, setIsAuctionOpen] = useState(false);

  // Generate mock bids
  const mockBids = [
    { id: 1, amount: listing.price, time: '2h ago' },
    { id: 2, amount: Math.floor(listing.price * 0.95), time: '3h ago' },
    { id: 3, amount: Math.floor(listing.price * 0.90), time: '5h ago' },
    { id: 4, amount: Math.floor(listing.price * 0.85), time: '6h ago' },
    { id: 5, amount: Math.floor(listing.price * 0.80), time: '8h ago' },
  ].sort((a, b) => b.amount - a.amount);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <img 
          src={listing.image} 
          alt={listing.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-xl font-semibold text-white">{listing.name}</h3>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <p className="text-sm text-gray-600">{listing.beds} beds · {listing.baths} bath · {listing.type} · Floor {listing.floor}</p>
          <button onClick={() => onInfo(listing)} className="text-blue-500 hover:text-blue-600">
            <Info className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-3 mb-3">
          {listing.features.map((feature, index) => (
            <span key={index} className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {feature === 'Wifi' && <Wifi className="h-4 w-4 mr-2" />}
              {feature === 'Kitchen' && <UtensilsCrossed className="h-4 w-4 mr-2" />}
              {feature === 'Gym' && <Dumbbell className="h-4 w-4 mr-2" />}
              {feature === 'Study Areas' && <Pencil className="h-4 w-4 mr-2" />}
              {feature}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-600 mb-3">Fall Semester Lease</p>
        <p className="font-semibold text-2xl text-[#6B7FF0] mb-4">${listing.price} <span className="font-normal text-gray-600 text-base">/month</span></p>
        <button 
          onClick={() => onBid(listing)}
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
            <AuctionTable bids={mockBids} />
          </div>
        )}
      </div>
    </div>
  );
};

const MapView = ({ listings }) => {
  // Function to convert coordinates to relative positions
  const calculateMapPosition = (coordinates) => {
    // Define the map boundaries (Georgia Tech area)
    const mapBounds = {
      north: 33.7856, // Max latitude
      south: 33.7656, // Min latitude
      east: -84.3763, // Max longitude
      west: -84.4063  // Min longitude
    };

    // Calculate relative positions as percentages
    const left = ((coordinates[1] - mapBounds.west) / (mapBounds.east - mapBounds.west) * 100);
    const top = ((mapBounds.north - coordinates[0]) / (mapBounds.north - mapBounds.south) * 100);

    // Ensure positions stay within bounds
    return {
      left: Math.max(0, Math.min(100, left)) + '%',
      top: Math.max(0, Math.min(100, top)) + '%'
    };
  };

  return (
    <div className="col-span-3 bg-white rounded-2xl h-[calc(100vh-240px)] overflow-hidden shadow-lg">
      <div className="h-full relative">
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyB-EEByU7chvVTZDIZyaaPzUwPhpFPPfB8&q=Georgia+Tech,Atlanta+GA&zoom=14`}
        ></iframe>
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50%" cy="50%" r="200" fill="#6B7FF0" fillOpacity="0.2" />
          </svg>
        </div>
        {listings.map((listing) => {
          const position = calculateMapPosition(listing.coordinates);
          return (
            <div key={listing.id} className="absolute" style={position}>
              <div className="bg-white rounded-full px-3 py-1 shadow-lg flex items-center space-x-1">
                <span className="text-[#6B7FF0] font-semibold text-sm">${listing.price}</span>
                <svg className="h-4 w-4 text-[#6B7FF0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
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
  const [listings, setListings] = useState(initialListings);
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
  const [bidAmount, setBidAmount] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [mapCenter, setMapCenter] = useState([33.7756, -84.3963]); // Georgia Tech coordinates
  const [mapZoom, setMapZoom] = useState(13);

  useEffect(() => {
    applyFilters();
  }, [filters, searchInput]);

  const applyFilters = () => {
    let filteredListings = initialListings.filter(listing => {
      const distance = calculateDistance(mapCenter[0], mapCenter[1], listing.coordinates[0], listing.coordinates[1]);
      return (
        listing.price >= filters.priceRange[0] &&
        listing.price <= filters.priceRange[1] &&
        (filters.bedrooms === 0 || listing.beds >= filters.bedrooms) &&
        (filters.bathrooms === 0 || listing.baths >= filters.bathrooms) &&
        (filters.propertyType === '' || listing.type === filters.propertyType) &&
        (filters.amenities.length === 0 || filters.amenities.every(amenity => listing.features.includes(amenity))) &&
        distance <= filters.radius &&
        listing.name.toLowerCase().includes(searchInput.toLowerCase())
      );
    });

    // Apply sorting
    switch (filters.sortBy) {
      case 'price_asc':
        filteredListings.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filteredListings.sort((a, 

 b) => b.price - a.price);
        break;
      case 'relevance':
        filteredListings.sort((a, b) => b.relevanceScore - a.relevanceScore);
        break;
      default:
        break;
    }

    setListings(filteredListings);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959; // Radius of the earth in miles
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in miles
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180)
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [filterName]: value }));
  };

  const handleBid = (listing) => {
    setModalState(prev => ({ ...prev, bid: { isOpen: true, listing } }));
    setBidAmount(listing.price.toString());
  };

  const handleInfo = (listing) => {
    setModalState(prev => ({ ...prev, info: { isOpen: true, listing } }));
  };

  const submitBid = () => {
    const bidValue = parseInt(bidAmount);
    const listingPrice = modalState.bid.listing.price;
    let chance;
    if (bidValue >= listingPrice * 1.1) {
      chance = 95;
    } else if (bidValue >= listingPrice) {
      chance = 70 + (bidValue - listingPrice) / (listingPrice * 0.1) * 25;
    } else {
      chance = Math.max(0, 70 - (listingPrice - bidValue) / (listingPrice * 0.1) * 70);
    }
    console.log(`Bid of $${bidAmount} placed on ${modalState.bid.listing.name} with ${chance.toFixed(2)}% chance of success`);
    setModalState(prev => ({ ...prev, bid: { isOpen: false, listing: null } }));
  };

  const closeModal = (modalName) => {
    setModalState(prev => ({ ...prev, [modalName]: { isOpen: false, listing: null } }));
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6 font-sans bg-[#FFF8F0] min-h-screen">
      <div className="flex items-center space-x-2 mb-8">
        <div className="flex-grow flex items-center space-x-2 bg-white rounded-full p-2 shadow-md border border-gray-200">
          <input 
            type="text" 
            placeholder="Search by property name" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-grow border-none bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 text-lg px-4"
          />
          <div className="w-px h-8 bg-gray-200"></div>
          <input 
            type="text" 
            placeholder="Aug 1 - Dec 15" 
            className="w-40 border-none bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 text-lg px-4"
          />
          <button className="bg-[#6B7FF0] text-white p-2 rounded-full hover:bg-[#5A6FE0] transition-colors">
            <Search className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
        <FilterButton 
          icon={DollarSign} 
          label={`$${filters.priceRange[0]} - $${filters.priceRange[1]}`} 
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
          <MapView listings={listings} center={mapCenter} zoom={mapZoom} radius={filters.radius} />
        </div>
        <div className="col-span-2 space-y-6 overflow-y-auto h-[calc(100vh-240px)] pr-4">
          <div className="text-xl text-gray-800 font-semibold">{listings.length} stays near Georgia Tech</div>
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} onBid={handleBid} onInfo={handleInfo} />
          ))}
        </div>
      </div>

      <Modal
        isOpen={modalState.bid.isOpen}
        onClose={() => closeModal('bid')}
        title="Place a Bid"
      >
        <p className="mb-4">Current price: ${modalState.bid.listing?.price}/month</p>
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
            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${Math.min(100, (parseInt(bidAmount) / modalState.bid.listing?.price) * 100)}%`}}></div>
          </div>
        </div>
        <button onClick={submitBid} className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
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