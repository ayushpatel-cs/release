import React, { useState } from 'react'
import { Camera, Upload, Mail, Phone, MapPin, Star, Briefcase, GraduationCap, Heart, Plus } from 'lucide-react'
import homepageImage from '../../images/homepage.png'
import apartment1Image from '../../images/apartment_1.jpg'
import apartment2Image from '../../images/apartment_2.webp'
import apartment3Image from '../../images/apartment_3.jpg'
import condo1Image from '../../images/condo_1.jpg'
import johnDoeImage from '../../images/john_doe.jpeg'
import { useAuth } from '../../contexts/AuthContext';
import { useUserData } from '../../hooks/useUserData';
import api from '../../utils/api';

// Mock data
const user = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1 (555) 123-4567',
  location: 'Atlanta, GA',
  bio: 'Avid traveler and food enthusiast. Always looking for the next adventure and the best local cuisines. Software developer by day, amateur chef by night.',
  joinedDate: 'January 2022',
  languages: ['English', 'Spanish'],
  occupation: 'Software Developer',
  education: 'Bachelors in Computer Science',
  pets: 'Dog-friendly',
  verifications: ['Email', 'Phone', 'Government ID'],
  profileImage: johnDoeImage,
}

const listings = [
  { id: 1, image: apartment1Image, title: 'Cozy Downtown Apartment', location: '123 Main St, Atlanta, GA', price: '$1000/month', rating: 4.8, reviews: 15 },
  { id: 2, image: apartment2Image, title: 'Spacious Suburban House', location: '456 Oak Ave, Atlanta, GA', price: '$1500/month', rating: 4.5, reviews: 8 },
]

const stays = [
  { id: 1, image: condo1Image, title: 'Modern Loft', location: '789 Pine Rd, Atlanta, GA', daysUntilStart: 5, duration: '3 months', host: 'Jane Smith' },
  { id: 2, image: apartment3Image, title: 'Beachfront Condo', location: '101 Elm St, Miami, FL', daysUntilStart: 12, duration: '6 months', host: 'Mike Johnson' },
]

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showAddListingForm, setShowAddListingForm] = useState(false)
  const { user } = useAuth();
  const { userData, listings, bids, loading, error } = useUserData(user?.id);
  const [newListing, setNewListing] = useState({
    title: '',
    location: '',
    price: '',
    image: null,
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
    const file = event.target.files[0]
    if (file) {
      setNewListing(prev => ({ ...prev, image: URL.createObjectURL(file) }))
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setNewListing(prev => ({ ...prev, [name]: value }))
  }

  const handleAddListing = async (event) => {
    event.preventDefault();
    
    try {
      const formData = new FormData();
      
      // Add text fields to formData
      formData.append('title', newListing.title);
      formData.append('description', newListing.description || '');
      formData.append('address', newListing.location);
      formData.append('min_price', parseFloat(newListing.price));
      
      // Add dates (you might want to add date inputs to your form)
      const today = new Date();
      formData.append('start_date', today.toISOString());
      formData.append('end_date', new Date(today.setMonth(today.getMonth() + 3)).toISOString());
      
      // Add the image file
      if (newListing.imageFile) {
        formData.append('images', newListing.imageFile);
      }
      
      const response = await api.post('/properties', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setShowAddListingForm(false);
      setNewListing({
        title: '',
        location: '',
        price: '',
        description: '',
        image: null,
        imageFile: null
      });
      
      // Refresh listings using your useUserData hook
      // You might want to add a refresh function to your hook
      window.location.reload();
    } catch (error) {
      console.error('Error adding listing:', error);
      alert('Failed to create listing: ' + (error.response?.data?.error || error.message));
    }
  };

  const ProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="relative">
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-32 h-32 rounded-full object-cover"
          />
          <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
            <Camera size={20} className="text-gray-600" />
          </button>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-1">{user.name}</h2>
          <p className="text-gray-600 mb-2">Joined {user.joinedDate}</p>
          <div className="flex space-x-2">
            {user.verifications.map((verification, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                ✓ {verification}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-2">About Me</h3>
        <p className="text-gray-700 leading-relaxed">{user.bio}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-2">Contact Information</h3>
          <div className="space-y-2">
            <p className="flex items-center"><Mail className="mr-2 text-blue-500" size={18} /> {user.email}</p>
            <p className="flex items-center"><Phone className="mr-2 text-blue-500" size={18} /> {user.phone}</p>
            <p className="flex items-center"><MapPin className="mr-2 text-blue-500" size={18} /> {user.location}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-2">Additional Information</h3>
          <div className="space-y-2">
            <p className="flex items-center"><Briefcase className="mr-2 text-blue-500" size={18} /> {user.occupation}</p>
            <p className="flex items-center"><GraduationCap className="mr-2 text-blue-500" size={18} /> {user.education}</p>
            <p className="flex items-center"><Heart className="mr-2 text-blue-500" size={18} /> {user.pets}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-2">Languages</h3>
        <div className="flex flex-wrap gap-2">
          {user.languages.map((language, index) => (
            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {language}
            </span>
          ))}
        </div>
      </div>
    </div>
  )

  const ListingsTab = () => (
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Listing</h3>
            <form onSubmit={handleAddListing} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
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
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={newListing.location}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Minimum Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={newListing.price}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageUpload}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  accept="image/*"
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

      <div className="space-y-4">
        {listings.map(listing => (
          <div key={listing.id} className="bg-white p-4 rounded-lg shadow flex">
            <img src={listing.image} alt={listing.title} className="w-32 h-32 object-cover rounded-lg mr-4" />
            <div>
              <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
              <p className="text-gray-600 mb-1">{listing.location}</p>
              <p className="font-bold mb-1">{listing.price}</p>
              <div className="flex items-center">
                <Star className="text-yellow-400 mr-1" size={16} />
                <span>{listing.rating} ({listing.reviews} reviews)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const StaysTab = () => (
    <div className="space-y-6">
      {stays.map(stay => (
        <div key={stay.id} className="bg-white p-4 rounded-lg shadow flex">
          <img src={stay.image} alt={stay.title} className="w-32 h-32 object-cover rounded-lg mr-4" />
          <div>
            <h3 className="font-semibold text-lg mb-1">{stay.title}</h3>
            <p className="text-gray-600 mb-1">{stay.location}</p>
            <p className="mb-1">Hosted by: {stay.host}</p>
            <p className="mb-1">Starts in {stay.daysUntilStart} days</p>
            <p>Duration: {stay.duration}</p>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white p-1 rounded-lg mb-6 flex">
          {['profile', 'listings', 'stays'].map((tab) => (
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
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'listings' && <ListingsTab />}
        {activeTab === 'stays' && <StaysTab />}
      </div>
    </div>
  )
}