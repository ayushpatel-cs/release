import React, { useState } from 'react'
import { Camera, Upload, Mail, Phone, MapPin, Star, Briefcase, GraduationCap, Heart } from 'lucide-react'
import homepageImage from '../../images/homepage.png'
import apartment2Image from '../../images/apartment_2.webp'
import apartment3Image from '../../images/apartment_3.jpg'
import condo1Image from '../../images/condo_1.jpg'
import johnDoeImage from '../../images/john_doe.jpeg'

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
  { id: 1, image: homepageImage, title: 'Cozy Downtown Apartment', location: '123 Main St, Atlanta, GA', price: '$1000/month', rating: 4.8, reviews: 15 },
  { id: 2, image: apartment2Image, title: 'Spacious Suburban House', location: '456 Oak Ave, Atlanta, GA', price: '$1500/month', rating: 4.5, reviews: 8 },
]

const stays = [
  { id: 1, image: apartment3Image, title: 'Modern Loft', location: '789 Pine Rd, Atlanta, GA', daysUntilStart: 5, duration: '3 months', host: 'Jane Smith' },
  { id: 2, image: condo1Image, title: 'Beachfront Condo', location: '101 Elm St, Miami, FL', daysUntilStart: 12, duration: '6 months', host: 'Mike Johnson' },
]

export default function UserDashboard() {
  const [images, setImages] = useState([])
  const [activeTab, setActiveTab] = useState('profile')

  const handleImageUpload = (event) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setImages(prevImages => [...prevImages, ...newImages])
    }
  }

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
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-2">Add Images</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {images.map((image, index) => (
            <img key={index} src={image} alt={`Uploaded ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
          ))}
          <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
            <Camera className="text-gray-400 mr-2" size={24} />
            <span className="text-gray-500">Add Photo</span>
            <input type="file" className="hidden" onChange={handleImageUpload} multiple accept="image/*" />
          </label>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-2">Upload Lease Agreement</h3>
        <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <Upload className="text-blue-500 mr-2" size={24} />
          <span className="text-blue-500 font-medium">Upload Lease Agreement</span>
          <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
        </label>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-2">Property Details</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input id="name" className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g. Austin Rental" />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input id="price" className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g. $1000 / month" />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input id="location" className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g. University House - 800 Spring St NW, Atlanta, GA" />
          </div>
          <div>
            <label htmlFor="season" className="block text-sm font-medium text-gray-700 mb-1">Season</label>
            <input id="season" className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g. Summer" />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea id="notes" className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g. No pets, parking included" rows="3"></textarea>
          </div>
          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">Post Listing</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listings.map(listing => (
          <div key={listing.id} className="bg-white p-4 rounded-lg shadow">
            <img src={listing.image} alt={listing.title} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
            <p className="text-gray-600 mb-2">{listing.location}</p>
            <p className="font-bold text-lg mb-2">{listing.price}</p>
            <div className="flex items-center">
              <Star className="text-yellow-400 mr-1" size={16} />
              <span>{listing.rating} ({listing.reviews} reviews)</span>
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