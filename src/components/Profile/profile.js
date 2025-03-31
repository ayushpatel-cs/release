import React, { useState, useEffect, useRef } from 'react'
import { Camera, Upload, Mail, Phone, MapPin, Star, Briefcase, GraduationCap, Heart, Plus } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext';
import { useUserData } from '../../hooks/useUserData';
import api from '../../utils/api';
import PropertyAddressAutocomplete from '../Common/PropertyAddressAutocomplete';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa'; // Import icons
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
  const { user } = useAuth();


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
      const response = await api.put('/users/profile/image', formData)
      
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
  handleAddListing,
  handleEditListing,
  handleDeleteListing,
}) => {
  const { active_listings = [], past_listings = [] } = listings || {};
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Listings</h2>
        <button
          type="button"
          onClick={() => {
            console.log("HIII");
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
              id: null, // Ensure ID is cleared for new listings
            });
            console.log(newListing);
            setShowAddListingForm(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition duration-300"
        >
          <Plus className="mr-2" size={20} />
          Add Listing
        </button>
      </div>

      {showAddListingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div
          className="bg-white rounded-lg p-8 w-full max-w-2xl" // Increased max-width and padding
          style={{ maxHeight: '90vh', overflowY: 'auto' }} // Increased height for better visibility
        >
            <h3 className="text-xl font-bold mb-4">Add New Listing</h3>
            <form onSubmit={handleAddListing} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-lg font-bold mb-4 text-gray-700 mb-1">
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
                <label htmlFor="description" className="block text-med font-bold mb-4 text-gray-700 mb-1">
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
                <label className="block text-med font-bold mb-4 text-gray-700 mb-1">
                  Address
                </label>
                <PropertyAddressAutocomplete
                  onLocationSelect={(locationData) => {
                    console.log('Raw location data:', locationData); // Debug log
                    setNewListing((prev) => ({
                      ...prev,
                      address_line1: locationData.address_line1,
                      city: locationData.city,
                      state: locationData.state,
                      zip_code: locationData.zip_code,
                      formatted_address: locationData.formatted_address,
                      latitude: locationData.latitude,
                      longitude: locationData.longitude,
                      place_id: locationData.place_id,
                    }));
                  }}
                  placeholder={newListing.address_line1 || 'Enter property address'} // Pre-fill for editing
                />
              </div>

              <div>
                <label htmlFor="start_date" className="block text-med font-bold mb-4 text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={newListing.start_date}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="end_date" className="block text-med font-bold mb-4 text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={newListing.end_date}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label htmlFor="auction_end_date" className="block text-med font-bold mb-4 text-gray-700 mb-1">
                  Auction End Date
                </label>
                <input
                  type="date"
                  id="auction_end_date"
                  name="auction_end_date"
                  value={newListing.auction_end_date}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>



              <div>
                <label htmlFor="price" className="block text-med font-bold mb-4 text-gray-700 mb-1">
                  Suggested Price
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
              {/* Number of Bathrooms */}
              <div>
                <label htmlFor="bathrooms" className="block text-med font-bold mb-4 text-gray-700 mb-1">
                  Number of Bathrooms (in apartment)
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={newListing.bathrooms || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  step="1"
                  required
                />
              </div>

              {/* Number of Bedrooms */}
              <div>
                <label htmlFor="bedrooms" className="block text-med font-bold mb-4 text-gray-700 mb-1">
                  Number of Bedrooms (in apartment)
                </label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={newListing.bedrooms || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  step="1"
                  required
                />
              </div>

              
              {/* Guest Favorites Section */}
              <div>
                <h3 className="text-lg font-bold mb-4">Do you have these main amenities?</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Wifi" },
                    { label: "TV" },
                    { label: "Kitchen" },
                    { label: "Washer" },
                    { label: "Free parking on premises" },
                    { label: "Paid parking on premises" },
                    { label: "Air conditioning" },
                    { label: "Study spaces" },
                  ].map((amenity) => {
                    const isSelected =
                      newListing.amenities && newListing.amenities.includes(amenity.label);
                    return (
                      <button
                        key={amenity.label}
                        type="button"
                        className={`flex items-center justify-center p-4 border rounded-lg transition ${
                          isSelected
                            ? "bg-blue-500 text-white border-blue-500"
                            : "border-gray-300 hover:bg-blue-100 hover:border-blue-400"
                        }`}
                        onClick={() => {
                          setNewListing((prev) => {
                            const amenities = prev.amenities || [];
                            if (amenities.includes(amenity.label)) {
                              // Remove the amenity if already selected
                              return {
                                ...prev,
                                amenities: amenities.filter((item) => item !== amenity.label),
                              };
                            } else {
                              // Add the amenity if not selected
                              return { ...prev, amenities: [...amenities, amenity.label] };
                            }
                          });
                        }}
                      >
                        <span className="text-sm font-medium">{amenity.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Standout Amenities Section */}
              <div>
                <h3 className="text-lg font-bold mb-4">Do you have any standout amenities?</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Pool" },
                    { label: "Hot tub" },
                    { label: "BBQ grill" },
                    { label: "Pool table" },
                    { label: "Piano" },
                    { label: "Exercise equipment/gym" },
                  ].map((amenity) => {
                    const isSelected =
                      newListing.amenities && newListing.amenities.includes(amenity.label);
                    return (
                      <button
                        key={amenity.label}
                        type="button"
                        className={`flex items-center justify-center p-4 border rounded-lg transition ${
                          isSelected
                            ? "bg-blue-500 text-white border-blue-500"
                            : "border-gray-300 hover:bg-blue-100 hover:border-blue-400"
                        }`}
                        onClick={() => {
                          setNewListing((prev) => {
                            const amenities = prev.amenities || [];
                            if (amenities.includes(amenity.label)) {
                              // Remove the amenity if already selected
                              return {
                                ...prev,
                                amenities: amenities.filter((item) => item !== amenity.label),
                              };
                            } else {
                              // Add the amenity if not selected
                              return { ...prev, amenities: [...amenities, amenity.label] };
                            }
                          });
                        }}
                      >
                        <span className="text-sm font-medium">{amenity.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Safety Items Section */}
              <div>
                <h3 className="text-lg font-bold mb-4">Do you have any of these safety items?</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Smoke alarm" },
                    { label: "First aid kit" },
                    { label: "Fire extinguisher" },
                    { label: "Carbon monoxide alarm" },
                  ].map((amenity) => {
                    const isSelected =
                      newListing.amenities && newListing.amenities.includes(amenity.label);
                    return (
                      <button
                        key={amenity.label}
                        type="button"
                        className={`flex items-center justify-center p-4 border rounded-lg transition ${
                          isSelected
                            ? "bg-blue-500 text-white border-blue-500"
                            : "border-gray-300 hover:bg-blue-100 hover:border-blue-400"
                        }`}
                        onClick={() => {
                          setNewListing((prev) => {
                            const amenities = prev.amenities || [];
                            if (amenities.includes(amenity.label)) {
                              // Remove the amenity if already selected
                              return {
                                ...prev,
                                amenities: amenities.filter((item) => item !== amenity.label),
                              };
                            } else {
                              // Add the amenity if not selected
                              return { ...prev, amenities: [...amenities, amenity.label] };
                            }
                          });
                        }}
                      >
                        <span className="text-sm font-medium">{amenity.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>




              <div>
                <label className="block text-med font-medium text-gray-700 mb-1">
                  Images {newListing.id ? '(Optional)' : '(Required)'}
                </label>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  accept="image/*"
                  multiple={!newListing.id} // Allow multiple uploads only for new listings
                />
                {newListing.images && newListing.images.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {newListing.images.map((image, index) => (
                      <img 
                        key={index}
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="h-32 w-32 object-cover rounded-md"
                      />
                    ))}
                  </div>
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
                  Save
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
            {active_listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white p-4 rounded-lg shadow flex items-center space-x-4 cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={() => navigate(`/listings/${listing.id}/user/${user.id}`)} // Navigate to details page
              >
                <img
                  src={listing.images?.[0]?.image_url || '/placeholder.jpg'}
                  alt={listing.title}
                  className="w-32 h-32 object-cover rounded-lg mr-4"
                  onError={(e) => {
                    console.error('Listing image failed to load:', e.target.src);
                    e.target.src = '/placeholder.jpg';
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
                  <p className="text-gray-600 mb-1">{listing.address}</p>
                  <p className="font-bold text-gray-700">${listing.min_price?.toLocaleString()}</p>
                </div>
                <div className="flex space-x-3">
                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation
                      handleEditListing(listing);
                    }}
                    className="flex items-center px-3 py-2 bg-green-100 text-green-600 rounded-md border border-green-600 hover:bg-green-600 hover:text-white transition duration-300"
                    title="Edit Listing"
                  >
                    <FaEdit size={14} className="mr-1" />
                    Edit
                  </button>
                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation
                      handleDeleteListing(listing.id);
                    }}
                    className="flex items-center px-3 py-2 bg-red-100 text-red-600 rounded-md border border-red-600 hover:bg-red-600 hover:text-white transition duration-300"
                    title="Delete Listing"
                  >
                    <FaTrash size={14} className="mr-1" />
                    Delete
                  </button>
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
    images: [],
    imageFiles: [],
    start_date: '', // Add this line
    end_date: '',    // Add this line
    auction_end_date: ''
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
    const files = Array.from(event.target.files);

    if (files.length < 5) {
      alert('Please upload at least 5 images.');
      event.target.value = ''; // Reset the input
      return;
    }
    if (files.length >= 5) {
      const imagePreviews = files.map(file => URL.createObjectURL(file));
      setNewListing(prev => ({ 
        ...prev, 
        images: imagePreviews,
        imageFiles: files
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
if (!newListing.title || !newListing.address_line1) {
  throw new Error('Title and address are required');
}
if (!newListing.start_date || !newListing.end_date || !newListing.auction_end_date) {
  throw new Error('Start date, end date, and auction end date are required');
}
if (!newListing.id && (!newListing.imageFiles || newListing.imageFiles.length < 5)) {
  throw new Error('Please upload at least 5 images for new listings');
}
      const formData = new FormData();
  
      // Append all necessary fields only once
      formData.append('title', newListing.title || '');
      formData.append('description', newListing.description || '');
      formData.append('min_price', newListing.price || '');
      formData.append('address_line1', newListing.address_line1 || '');
      formData.append('city', newListing.city || '');
      formData.append('state', newListing.state || '');
      formData.append('zip_code', newListing.zip_code || '');
      formData.append('formatted_address', newListing.formatted_address || '');
      formData.append('latitude', newListing.latitude || '');
      formData.append('longitude', newListing.longitude || '');
      formData.append('place_id', newListing.place_id || '');
  
      formData.append('start_date', new Date(newListing.start_date).toISOString());
      formData.append('end_date', new Date(newListing.end_date).toISOString());
      formData.append('auction_end_date', new Date(newListing.auction_end_date).toISOString());
      formData.append('bedrooms', newListing.bedrooms);
      formData.append('bathrooms', newListing.bathrooms);
      formData.append('amenities', JSON.stringify(newListing.amenities || []));

      // Images
      if (newListing.imageFiles && newListing.imageFiles.length > 0) {
        newListing.imageFiles.forEach(file => {
          formData.append('images', file);
        });
      }
  
      // Debug log
      for (let pair of formData.entries()) {
        console.log('FormData entry:', pair[0], pair[1]);
      }
  
      if (newListing.id) {
        // Edit existing listing
        const response = await api.put(`/properties/${newListing.id}`, formData);
        console.log('Listing updated:', response.data);
      } else {
        // Add new listing
        const response = await api.post('/properties', formData);
        console.log('Property created:', response.data);
      }
  
      // Reset the form and refresh data
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
        start_date: '',
        end_date: '',
        auction_end_date: '',
        bedrooms: 0,
        bathrooms: 0,
        images: [],
        imageFiles: [],
        id: null,
      });
      await refreshData();
    } catch (error) {
      console.error('Error creating/updating listing:', error);
      alert('Failed to create/update listing: ' + (error.response?.data?.error || error.message));
    }
  };
  
  const handleEditListing = (listing) => {
    setNewListing({
      id: listing.id,
      title: listing.title || '',
      description: listing.description || '',
      address_line1: listing.address_line1 || '',
      city: listing.city || '',
      state: listing.state || '',
      zip_code: listing.zip_code || '',
      formatted_address: listing.formatted_address || '',
      latitude: listing.latitude || null,
      longitude: listing.longitude || null,
      place_id: listing.place_id || '',
      start_date: listing.start_date ? listing.start_date.split('T')[0] : '', // Format as YYYY-MM-DD
      end_date: listing.end_date ? listing.end_date.split('T')[0] : '', // Format as YYYY-MM-DD
      auction_end_date: listing.auction_end_date ? listing.auction_end_date.split('T')[0] : '',
      price: listing.min_price || '',
      bedrooms: listing.bedrooms || 0,
      bathrooms: listing.bathrooms || 0,
      amenities: listing.amenities || [], // Ensure amenities are loaded
    });
    setShowAddListingForm(true); // Open the form
  };
  
  
  
  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
  
    try {
      await api.delete(`/properties/${listingId}`);
      console.log(`Listing ${listingId} deleted`);
      await refreshData();
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing: ' + (error.response?.data?.error || error.message));
    }
  };

  const BidsTab = () => {
    const navigate = useNavigate();

    if (!bids) return <div>Loading bids...</div>;

    const { active_bids, won_bids, lost_bids } = bids;

    const BidCard = ({ bid }) => (
      
  <div className="bg-white p-4 rounded-lg shadow flex" onClick={() => navigate(`/listings/${bid.Property.id}`)}>
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
            handleEditListing={handleEditListing}
            handleDeleteListing={handleDeleteListing}
          />
        )}
        {activeTab === 'bids' && <BidsTab />}
      </div>
    </div>
  )
}