import React from 'react';
import { Search, Sliders, Wifi, UtensilsCrossed, Dumbbell, Pencil, DollarSign, Bed, Bath, Home } from 'lucide-react';
import homepageImage from '../../images/homepage.png';
import apartment2Image from '../../images/apartment_2.webp';
import apartment3Image from '../../images/apartment_3.jpg';
import condo1Image from '../../images/condo_1.jpg';

const images = [homepageImage, apartment2Image, apartment3Image, condo1Image];

const listings = [
  { id: 1, name: "Hub Atlanta", beds: 2, baths: 2, type: "Apartment", floor: 5, price: 1850, features: ["Wifi", "Kitchen", "Gym", "Study Areas"], mapPosition: { top: "45%", left: "48%" } },
  { id: 2, name: "The Mark Atlanta", beds: 1, baths: 1, type: "Studio", floor: 3, price: 1200, features: ["Wifi", "Kitchen", "Laundry"], mapPosition: { top: "55%", left: "52%" } },
  { id: 3, name: "Square on Fifth", beds: 3, baths: 2, type: "Condo", floor: 8, price: 2400, features: ["Wifi", "Kitchen", "Gym", "Pool"], mapPosition: { top: "50%", left: "45%" } },
];

export default function ImprovedSearchInterface() {
  const getRandomImage = () => images[Math.floor(Math.random() * images.length)];

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
        <button className="px-4 py-2 bg-white text-gray-700 rounded-full shadow-sm hover:shadow-md transition-shadow border border-gray-200 flex items-center whitespace-nowrap">
          <DollarSign className="h-4 w-4 mr-2" /> Price Range
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 rounded-full shadow-sm hover:shadow-md transition-shadow border border-gray-200 flex items-center whitespace-nowrap">
          <Bed className="h-4 w-4 mr-2" /> Bedrooms
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 rounded-full shadow-sm hover:shadow-md transition-shadow border border-gray-200 flex items-center whitespace-nowrap">
          <Bath className="h-4 w-4 mr-2" /> Bathrooms
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 rounded-full shadow-sm hover:shadow-md transition-shadow border border-gray-200 flex items-center whitespace-nowrap">
          <Home className="h-4 w-4 mr-2" /> Property Type
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 rounded-full shadow-sm hover:shadow-md transition-shadow border border-gray-200 flex items-center whitespace-nowrap">
          <Wifi className="h-4 w-4 mr-2" /> Amenities
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 rounded-full shadow-sm hover:shadow-md transition-shadow border border-gray-200 flex items-center">
          More Filters <Sliders className="h-4 w-4 ml-2" />
        </button>
      </div>
      
      <div className="grid grid-cols-5 gap-8">
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
        <div className="col-span-2 space-y-6 overflow-y-auto h-[calc(100vh-240px)] pr-4">
          <div className="text-xl text-gray-800 font-semibold">200+ stays near Georgia Tech</div>
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img src={getRandomImage()} alt="Property" className="w-full h-56 object-cover" />
              <div className="p-6">
                <h3 className="font-semibold text-xl mb-2 text-gray-800">{listing.name}</h3>
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
                <p className="font-semibold text-2xl text-[#6B7FF0]">${listing.price} <span className="font-normal text-gray-600 text-base">/month</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}