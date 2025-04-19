import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mail, Phone, MapPin, Star, Briefcase, GraduationCap, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

const ProfileTab = ({ userData, refreshData }) => {
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
  const [error, setError] = useState(null);

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
      setError(null);
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
      setError('Failed to upload image: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError(null);
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
      setError('Failed to update profile: ' + (error.response?.data?.error || error.message));
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

  if (!isEditing) {
    return (
      <div className="space-y-6">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={profileData.profile_image_url || '/default-avatar.png'}
              alt={profileData.name}
              className="w-32 h-32 rounded-full object-cover cursor-pointer"
              onClick={handleImageClick}
              onError={(e) => {
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
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
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

export default ProfileTab; 