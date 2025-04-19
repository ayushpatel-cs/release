import React, { useState, useEffect, useRef } from 'react'
import { Camera, Upload, Mail, Phone, MapPin, Star, Briefcase, GraduationCap, Heart, Plus } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext';
import { useUserData } from '../../hooks/useUserData';
import api from '../../utils/api';
import PropertyAddressAutocomplete from '../Common/PropertyAddressAutocomplete';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa'; // Import icons
import ProfileTab from './ProfileTab';
import ListingsTab from './ListingsTab';
import BidsTab from './BidsTab';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuth();
  const { userData, refreshData } = useUserData();
  const navigate = useNavigate();
  const [listings, setListings] = useState({ active_listings: [], past_listings: [] });
  const [bids, setBids] = useState({ active_bids: [], past_bids: [] });
  const [showAddListingForm, setShowAddListingForm] = useState(false);
  const [error, setError] = useState(null);
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    price: '',
    address_line1: '',
    city: '',
    state: '',
    zip_code: '',
    formatted_address: '',
    latitude: null,
    longitude: null,
    place_id: '',
    images: [],
    imageFiles: [],
    auction_end_date: null,
    start_date: null,
    end_date: null,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch listings
        const listingsResponse = await api.get('/users/me/properties');
        setListings(listingsResponse.data);

        // Fetch bids
        const bidsResponse = await api.get('/users/me/bids');
        setBids(bidsResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch your data. Please try again later.');
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length > 0) {
      setNewListing(prev => ({
        ...prev,
        imageFiles: files
      }));
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewListing(prev => ({ ...prev, [name]: value }));
  };

  const handleAddListing = async (event) => {
    event.preventDefault();
    
    try {
      setError(null);
      const formData = new FormData();
      
      // Add basic listing data
      formData.append('title', newListing.title);
      formData.append('description', newListing.description);
      formData.append('price', newListing.price);
      formData.append('address_line1', newListing.address_line1);
      formData.append('city', newListing.city);
      formData.append('state', newListing.state);
      formData.append('zip_code', newListing.zip_code);
      formData.append('formatted_address', newListing.formatted_address);
      formData.append('latitude', newListing.latitude);
      formData.append('longitude', newListing.longitude);
      formData.append('place_id', newListing.place_id);
      formData.append('bathrooms', newListing.bathrooms);
      formData.append('bedrooms', newListing.bedrooms);
      formData.append('start_date', newListing.start_date);
      formData.append('end_date', newListing.end_date);
      formData.append('auction_end_date', newListing.auction_end_date);
      
      // Add amenities
      if (newListing.amenities) {
        newListing.amenities.forEach(amenity => {
          formData.append('amenities[]', amenity);
        });
      }
      
      // Add images
      if (newListing.imageFiles && newListing.imageFiles.length > 0) {
        Array.from(newListing.imageFiles).forEach(file => {
          formData.append('images', file);
        });
      }

      let response;
      
      if (newListing.id) {
        // Update existing listing
        response = await api.put(`/properties/${newListing.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Create new listing
        response = await api.post('/properties', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      // Refresh listings
      const listingsResponse = await api.get('/users/me/properties');
      setListings(listingsResponse.data);
      
      // Reset form and close modal
      setNewListing({
        title: '',
        description: '',
        price: '',
        address_line1: '',
        city: '',
        state: '',
        zip_code: '',
        formatted_address: '',
        latitude: null,
        longitude: null,
        place_id: '',
        images: [],
        imageFiles: [],
        auction_end_date: null,
        start_date: null,
        end_date: null,
      });
      setShowAddListingForm(false);
    } catch (error) {
      console.error('Error saving listing:', error);
      setError('Failed to save listing: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEditListing = (listing) => {
    setNewListing({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      price: listing.min_price,
      address_line1: listing.address_line1,
      city: listing.city,
      state: listing.state,
      zip_code: listing.zip_code,
      formatted_address: listing.formatted_address,
      latitude: listing.latitude,
      longitude: listing.longitude,
      place_id: listing.place_id,
      bathrooms: listing.bathrooms,
      bedrooms: listing.bedrooms,
      images: listing.images || [],
      imageFiles: [],
      amenities: listing.amenities || [],
      auction_end_date: listing.auction_end_date ? new Date(listing.auction_end_date).toISOString().split('T')[0] : '',
      start_date: listing.start_date ? new Date(listing.start_date).toISOString().split('T')[0] : '',
      end_date: listing.end_date ? new Date(listing.end_date).toISOString().split('T')[0] : '',
    });
    
    setShowAddListingForm(true);
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }
    
    try {
      setError(null);
      await api.delete(`/properties/${listingId}`);
      
      // Refresh listings
      const listingsResponse = await api.get('/users/me/properties');
      setListings(listingsResponse.data);
    } catch (error) {
      console.error('Error deleting listing:', error);
      setError('Failed to delete listing: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {/* Tab Navigation */}
      <div className="mb-6 border-b-2 border-gray-200">
        <div className="flex space-x-8">
          <button
            className={`py-2 px-1 -mb-px font-medium text-sm ${
              activeTab === 'profile'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          
          <button
            className={`py-2 px-1 -mb-px font-medium text-sm ${
              activeTab === 'listings'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('listings')}
          >
            Your Listings
          </button>
          
          <button
            className={`py-2 px-1 -mb-px font-medium text-sm ${
              activeTab === 'bids'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('bids')}
          >
            Your Bids
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="my-4">
        {activeTab === 'profile' && (
          <ProfileTab userData={userData} refreshData={refreshData} />
        )}
        
        {activeTab === 'listings' && (
          <ListingsTab
            listings={listings}
            showAddListingForm={showAddListingForm}
            setShowAddListingForm={setShowAddListingForm}
            newListing={newListing}
            setNewListing={setNewListing}
            handleInputChange={handleInputChange}
            handleImageUpload={handleImageUpload}
            handleAddListing={handleAddListing}
            handleEditListing={handleEditListing}
            handleDeleteListing={handleDeleteListing}
          />
        )}
        
        {activeTab === 'bids' && (
          <BidsTab bids={bids} />
        )}
      </div>
    </div>
  );
}