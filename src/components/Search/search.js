import React, { useState, useEffect } from 'react';
import { Search, Sliders, Wifi, UtensilsCrossed, Dumbbell, Pencil, DollarSign, Bed, Bath, Home, Info } from 'lucide-react';

// Assume these imports work correctly
import homepageImage from '../../images/homepage.png';
import apartment2Image from '../../images/apartment_2.webp';
import apartment3Image from '../../images/apartment_3.jpg';
import condo1Image from '../../images/condo_1.jpg';

const images = [homepageImage, apartment2Image, apartment3Image, condo1Image];

const initialListings = [
  { id: 1, name: "Hub Atlanta", beds: 2, baths: 2, type: "Apartment", floor: 5, price: 1850, features: ["Wifi", "Kitchen", "Gym", "Study Areas"], mapPosition: { top: "45%", left: "48%" }, description: "Modern apartment complex with state-of-the-art amenities." },
  { id: 2, name: "The Mark Atlanta", beds: 1, baths: 1, type: "Studio", floor: 3, price: 1200, features: ["Wifi", "Kitchen", "Laundry"], mapPosition: { top: "55%", left: "52%" }, description: "Cozy studio apartments perfect for students and young professionals." },
  { id: 3, name: "Square on Fifth", beds: 3, baths: 2, type: "Condo", floor: 8, price: 2400, features: ["Wifi", "Kitchen", "Gym", "Pool"], mapPosition: { top: "50%", left: "45%" }, description: "Luxurious condos with panoramic views of the Atlanta skyline." },
];

const FilterButton = ({ icon: Icon, label, onClick, active }) => (
  <button 
    className={`px-4 py-2 bg-white text-gray-700 rounded-full shadow-sm hover:shadow-md transition-shadow border border-gray-200 flex items-center whitespace-nowrap ${active ? 'bg-blue-100 border-blue-500' : ''}`}
    onClick={onClick}
  >
    <Icon className="h-4 w-4 mr-2" /> {label}
  </button>
);

const ListingCard = ({ listing, onBid, onInfo }) => {
  const getRandomImage = () => images[Math.floor(Math.random() * images.length)];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img src={getRandomImage()} alt="Property" className="w-full h-56 object-cover" />
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{listing.name}</h3>
          <button onClick={() => onInfo(listing)} className="text-blue-500 hover:text-blue-600">
            <Info className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-3">{listing.beds} beds {listing.baths} bath · {listing.type} · Floor {listing.floor}</p>
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
          className="w-full bg-[#6B7FF0] text-white py-2 rounded-lg hover:bg-[#5A6FE0] transition-colors"
        >
          Place Bid
        </button>
      </div>
    </div>
  );
};

const MapView = ({ listings }) => (
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
      {listings.map((listing) => (
        <div key={listing.id} className="absolute" style={{top: listing.mapPosition.top, left: listing.mapPosition.left}}>
          <div className="bg-white rounded-full px-3 py-1 shadow-lg flex items-center space-x-1">
            <span className="text-[#6B7FF0] font-semibold text-sm">${listing.price}</span>
            <svg className="h-4 w-4 text-[#6B7FF0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  </div>
);

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
    amenities: []
  });
  const [modalState, setModalState] = useState({
    bid: { isOpen: false, listing: null },
    info: { isOpen: false, listing: null },
    priceRange: { isOpen: false },
    propertyType: { isOpen: false },
    amenities: { isOpen: false }
  });
  const [bidAmount, setBidAmount] = useState('');
  const [bidChance, setBidChance] = useState(50);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const applyFilters = () => {
    const filteredListings = initialListings.filter(listing => {
      return (
        listing.price >= filters.priceRange[0] &&
        listing.price <= filters.priceRange[1] &&
        (filters.bedrooms === 0 || listing.beds >= filters.bedrooms) &&
        (filters.bathrooms === 0 || listing.baths >= filters.bathrooms) &&
        (filters.propertyType === '' || listing.type === filters.propertyType) &&
        (filters.amenities.length === 0 || filters.amenities.every(amenity => listing.features.includes(amenity)))
      );
    });
    setListings(filteredListings);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [filterName]: value }));
  };

  const handleBid = (listing) => {
    setModalState(prev => ({ ...prev, bid: { isOpen: true, listing } }));
    setBidAmount(listing.price.toString());
    setBidChance(50);
  };

  const handleInfo = (listing) => {
    setModalState(prev => ({ ...prev, info: { isOpen: true, listing } }));
  };

  const submitBid = () => {
    console.log(`Bid of $${bidAmount} placed on ${modalState.bid.listing.name} with ${bidChance}% chance of success`);
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
            placeholder="Midtown, Atlanta" 
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
        <button className="px-4 py-2 bg-white text-gray-700 rounded-full shadow-sm hover:shadow-md transition-shadow border border-gray-200 flex items-center whitespace-nowrap">
          More Filters <Sliders className="h-4 w-4 ml-2" />
        </button>
      </div>
      
      <div className="grid grid-cols-5 gap-8">
        <MapView listings={listings} />
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
            onChange={(e) => {
              setBidAmount(e.target.value);
              setBidChance(Math.max(0, Math.min(100, (modalState.bid.listing?.price / parseInt(e.target.value)) * 100)));
            }}
            className="w-full p-2  border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Chance of Winning: {bidChance}%</label>
          <input
            type="range"
            min={0}
            max={100}
            value={bidChance}
            onChange={(e) => {
              setBidChance(parseInt(e.target.value));
              setBidAmount(((modalState.bid.listing?.price * 100) / parseInt(e.target.value)).toFixed(2));
            }}
            className="w-full"
          />
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
          <div className="flex justify-between text-sm text-gray-500">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
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