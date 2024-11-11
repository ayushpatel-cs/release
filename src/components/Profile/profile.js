import React, { useState, useEffect, useRef } from 'react'
import { Camera, Upload, Mail, Phone, MapPin, Star, Briefcase, GraduationCap, Heart, Plus } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext';
import { useUserData } from '../../hooks/useUserData';
import api from '../../utils/api';
import PropertyAddressAutocomplete from '../Common/PropertyAddressAutocomplete';

// Move ProfileTab outside of UserDashboard
const ProfileTab = ({ userData, onUpdateProfile, refreshData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    location: userData?.location || '',
    bio: userData?.bio || '',
    languages: userData?.languages || [],
    occupation: userData?.occupation || '',
    education: userData?.education || '',
    pets_preference: userData?.pets_preference || '',
    profile_image_url: userData?.profile_image_url || '',
    verifications: userData?.verifications || [],
    created_at: userData?.created_at || new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_image', file);

    try {
      setLoading(true);
      const response = await api.put('/users/profile/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setProfileData(prev => ({
        ...prev,
        profile_image_url: response.data.profile_image_url
      }));

      await refreshData();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      // Filter out read-only fields
      const updateData = {
        name: profileData.name,
        bio: profileData.bio,
        phone: profileData.phone,
        location: profileData.location,
        languages: profileData.languages,
        occupation: profileData.occupation,
        education: profileData.education,
        pets_preference: profileData.pets_preference,
        profile_image_url: profileData.profile_image_url
      };
      
      const response = await api.put('/users/profile', updateData);
      setProfileData(prev => ({
        ...prev,
        ...response.data
      }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Update profile data when userData changes
  useEffect(() => {
    if (userData) {
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        location: userData.location || '',
        bio: userData.bio || '',
        languages: userData.languages || [],
        occupation: userData.occupation || '',
        education: userData.education || '',
        pets_preference: userData.pets_preference || '',
        profile_image_url: userData.profile_image_url || '',
        verifications: userData.verifications || [],
        created_at: userData.created_at || new Date().toISOString()
      });
    }
  }, [userData]);

  console.log('Current profile image URL:', profileData.profile_image_url);

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-6">
        <div className="relative">
          <img
            src={profileData.profile_image_url || '/default-avatar.png'}
            alt={profileData.name}
            className="w-32 h-32 rounded-full object-cover cursor-pointer"
            onClick={handleImageClick}
            onError={(e) => {
              console.error('Image failed to load:', e.target.src);
              // Only fallback to default avatar if the main image fails
              if (e.target.src !== `${window.location.origin}/default-avatar.png`) {
                e.target.src = '/default-avatar.png';
              }
            }}
          />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <button 
            onClick={handleImageClick}
            className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <Camera size={20} className="text-gray-600" />
          </button>
          {loading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="text-white">Uploading...</div>
            </div>
          )}
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-1">{profileData.name}</h2>
          <p className="text-gray-600 mb-2">Joined {profileData.joinedDate}</p>
          <div className="flex space-x-2">
            {profileData.verifications.map((verification, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                ✓ {verification}
              </span>
            ))}
          </div>
        </div>
        <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Edit Profile
          </button>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-2">About Me</h3>
        <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-2">Contact Information</h3>
          <div className="space-y-2">
            <p className="flex items-center"><Mail className="mr-2 text-blue-500" size={18} /> {profileData.email}</p>
            <p className="flex items-center"><Phone className="mr-2 text-blue-500" size={18} /> {profileData.phone}</p>
            <p className="flex items-center"><MapPin className="mr-2 text-blue-500" size={18} /> {profileData.location}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-2">Additional Information</h3>
          <div className="space-y-2">
            <p className="flex items-center"><Briefcase className="mr-2 text-blue-500" size={18} /> {profileData.occupation}</p>
            <p className="flex items-center"><GraduationCap className="mr-2 text-blue-500" size={18} /> {profileData.education}</p>
            <p className="flex items-center"><Heart className="mr-2 text-blue-500" size={18} /> {profileData.pets_preference}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-2">Languages</h3>
        <div className="flex flex-wrap gap-2">
          {profileData.languages.map((language, index) => (
            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {language}
            </span>
          ))}
        </div>
      </div>
    </div>
    );
  }
  return (
    <form onSubmit={handleProfileUpdate} className="space-y-6">
      {/* Edit mode content */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={profileData.bio || ''}
              onChange={e => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="4"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={profileData.phone || ''}
                onChange={e => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={profileData.location || ''}
                onChange={e => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
              <input
                type="text"
                value={profileData.occupation || ''}
                onChange={e => setProfileData(prev => ({ ...prev, occupation: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
              <input
                type="text"
                value={profileData.education || ''}
                onChange={e => setProfileData(prev => ({ ...prev, education: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pets Preference</label>
              <input
                type="text"
                value={profileData.pets_preference || ''}
                onChange={e => setProfileData(prev => ({ ...prev, pets_preference: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
              <input
                type="text"
                value={profileData.languages?.join(', ') || ''}
                onChange={e => setProfileData(prev => ({ 
                  ...prev, 
                  languages: e.target.value.split(',').map(lang => lang.trim())
                }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter languages separated by commas"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  );
};

// Move ListingsTab outside UserDashboard
const ListingsTab = ({ 
  listings, 
  showAddListingForm, 
  setShowAddListingForm, 
  newListing, 
  setNewListing,
  handleInputChange, 
  handleImageUpload, 
  handleAddListing 
}) => {
  const { active_listings = [], past_listings = [] } = listings || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Listings</h2>
        <button
          onClick={() => setShowAddListingForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition duration-300"
        >
          <Plus className="mr-2" size={20} />
          Add Listing
        </button>
      </div>

      {showAddListingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Listing</h3>
            <form onSubmit={handleAddListing} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newListing.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newListing.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <PropertyAddressAutocomplete
                  onLocationSelect={(locationData) => {
                    console.log('Raw location data:', locationData); // Debug log
                    
                    // Parse address components
                    const getAddressComponent = (type) => {
                      const component = locationData.address_components.find(
                        comp => comp.types.includes(type)
                      );
                      return component ? component.long_name : '';
                    };

                    setNewListing(prev => ({
                      ...prev,
                      address_line1: locationData.address_line1,
                      city: locationData.city,
                      state: locationData.state,
                      zip_code: locationData.zip_code,
                      formatted_address: locationData.formatted_address,
                      latitude: locationData.latitude,
                      longitude: locationData.longitude,
                      place_id: locationData.place_id
                    }));
                  }}
                  placeholder="Enter property address"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={newListing.price}
                    onChange={handleInputChange}
                    className="w-full pl-8 p-2 border border-gray-300 rounded-md"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Images
                </label>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  accept="image/*"
                  multiple
                  required
                />
                {newListing.image && (
                  <img 
                    src={newListing.image} 
                    alt="Preview" 
                    className="mt-2 h-32 w-32 object-cover rounded-md"
                  />
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddListingForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Add Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Listings */}
      {active_listings.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">Active Listings</h3>
          <div className="space-y-4">
            {active_listings.map(listing => (
              <div key={listing.id} className="bg-white p-4 rounded-lg shadow flex">
                <img 
                  src={listing.images?.[0]?.image_url || '/placeholder.jpg'} 
                  alt={listing.title} 
                  className="w-32 h-32 object-cover rounded-lg mr-4"
                  onError={(e) => {
                    console.error('Listing image failed to load:', e.target.src);
                    e.target.src = '/placeholder.jpg';
                  }}
                />
                <div>
                  <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
                  <p className="text-gray-600 mb-1">{listing.address}</p>
                  <p className="font-bold mb-1">${listing.min_price?.toLocaleString()}</p>
                  <div className="flex items-center">
                    <Star className="text-yellow-400 mr-1" size={16} />
                    <span>{listing.rating || 'No ratings'} ({listing.reviews?.length || 0} reviews)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Listings */}
      {past_listings.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">Past Listings</h3>
          <div className="space-y-4">
            {past_listings.map(listing => (
              <div key={listing.id} className="bg-white p-4 rounded-lg shadow flex opacity-75">
                <img 
                  src={listing.images?.[0]?.image_url || '/placeholder.jpg'} 
                  alt={listing.title} 
                  className="w-32 h-32 object-cover rounded-lg mr-4" 
                />
                <div>
                  <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
                  <p className="text-gray-600 mb-1">{listing.address}</p>
                  <p className="font-bold mb-1">${listing.min_price?.toLocaleString()}</p>
                  <div className="flex items-center">
                    <Star className="text-yellow-400 mr-1" size={16} />
                    <span>{listing.rating || 'No ratings'} ({listing.reviews?.length || 0} reviews)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Listings Message */}
      {active_listings.length === 0 && past_listings.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No listings yet</p>
        </div>
      )}
    </div>
  );
};

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddListingForm, setShowAddListingForm] = useState(false);
  const { user } = useAuth();
  const { userData, listings, bids, loading, error, refreshData } = useUserData(user?.id);
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
    image: null,
    imageFile: null
  });

  if (loading) {
    return <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
      <div className="text-xl text-red-500">Error: {error}</div>
    </div>;
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewListing(prev => ({ 
        ...prev, 
        image: URL.createObjectURL(file),
        imageFile: file  // Store the actual file
      }));
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setNewListing(prev => ({ ...prev, [name]: value }))
  }

  const handleAddListing = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      
      // Basic listing details
      formData.append('title', newListing.title);
      formData.append('description', newListing.description);
      formData.append('min_price', newListing.price);
      
      // Validate address details exist
      if (!newListing.address_line1 || !newListing.city || !newListing.state || !newListing.zip_code) {
        throw new Error('Address details are required');
      }


      // Add each address field individually
      formData.append('address_line1', newListing.address_line1);
      formData.append('city', newListing.city);
      formData.append('state', newListing.state);
      formData.append('zip_code', newListing.zip_code);
      formData.append('formatted_address', newListing.formatted_address);
      formData.append('latitude', newListing.latitude);
      formData.append('longitude', newListing.longitude);
      formData.append('place_id', newListing.place_id);
      
      // Dates
      const today = new Date();
      formData.append('start_date', today.toISOString());
      formData.append('end_date', new Date(today.setMonth(today.getMonth() + 3)).toISOString());
      
      // Image
      if (newListing.imageFile) {
        formData.append('images', newListing.imageFile);
      }
      
      // Debug log
      for (let pair of formData.entries()) {
        console.log('FormData entry:', pair[0], pair[1]);
      }

      const response = await api.post('/properties', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Property created:', response.data);

      setShowAddListingForm(false);
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
        start_date: null,
        end_date: null,
        image: null,
        imageFile: null
      });
      
      await refreshData();
    } catch (error) {
      console.error('Error creating property:', error);
      alert('Failed to create listing: ' + (error.response?.data?.error || error.message));
    }
  };

  const BidsTab = () => {
    if (!bids) return <div>Loading bids...</div>;

    const { active_bids, won_bids, lost_bids } = bids;

    const BidCard = ({ bid }) => (
      <div className="bg-white p-4 rounded-lg shadow flex">
        <img 
          src={bid.Property?.images?.[0]?.image_url || '/placeholder.jpg'} 
          alt={bid.Property?.title} 
          className="w-32 h-32 object-cover rounded-lg mr-4" 
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg mb-1">{bid.Property?.title}</h3>
              <p className="text-gray-600 mb-1">{bid.Property?.formatted_address}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-green-600">${bid.amount.toLocaleString()}</p>
              <p className="text-sm text-gray-500">
                Bid placed: {new Date(bid.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="mt-2">
            <span className={`px-2 py-1 rounded-full text-sm ${
              bid.status === 'active' ? 'bg-blue-100 text-blue-800' :
              bid.status === 'won' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
            </span>
          </div>
        </div>
      </div>
    );

    return (
      <div className="space-y-6">
        {active_bids.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Active Bids</h2>
            <div className="space-y-4">
              {active_bids.map(bid => (
                <BidCard key={bid.id} bid={bid} />
              ))}
            </div>
          </div>
        )}

        {won_bids.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Won Bids</h2>
            <div className="space-y-4">
              {won_bids.map(bid => (
                <BidCard key={bid.id} bid={bid} />
              ))}
            </div>
          </div>
        )}

        {lost_bids.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Past Bids</h2>
            <div className="space-y-4">
              {lost_bids.map(bid => (
                <BidCard key={bid.id} bid={bid} />
              ))}
            </div>
          </div>
        )}

        {active_bids.length === 0 && won_bids.length === 0 && lost_bids.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No bids yet</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white p-1 rounded-lg mb-6 flex">
          {['profile', 'listings', 'bids'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 rounded-md ${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {activeTab === 'profile' && (
          <ProfileTab 
            userData={userData} 
            refreshData={refreshData} 
          />
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
          />
        )}
        {activeTab === 'bids' && <BidsTab />}
      </div>
    </div>
  )
}