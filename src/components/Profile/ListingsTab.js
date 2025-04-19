import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import PropertyAddressAutocomplete from '../Common/PropertyAddressAutocomplete';

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
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md"
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
                  value={newListing.bathrooms}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
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
                  value={newListing.bedrooms}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  required
                />
              </div>
              {/* Amenities */}
              <div>
                <label className="block text-med font-bold mb-4 text-gray-700 mb-1">Amenities</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Wifi', 'Gym', 'Pool', 'Pet Friendly', 'Furnished', 'Parking', 'Laundry', 'Air Conditioning'].map((amenity) => (
                    <div key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`amenity-${amenity}`}
                        name="amenities"
                        value={amenity}
                        checked={newListing.amenities?.includes(amenity) || false}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setNewListing((prev) => ({
                            ...prev,
                            amenities: isChecked
                              ? [...(prev.amenities || []), amenity]
                              : (prev.amenities || []).filter((a) => a !== amenity),
                          }));
                        }}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor={`amenity-${amenity}`} className="text-sm">{amenity}</label>
                    </div>
                  ))}
                </div>
              </div>
              {/* Image Upload */}
              <div>
                <label className="block text-med font-bold mb-4 text-gray-700 mb-1">Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {newListing.imageFiles && newListing.imageFiles.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Array.from(newListing.imageFiles).map((file, index) => (
                      <div key={index} className="relative w-24 h-24">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Uploaded ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}
                {newListing.images && newListing.images.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {newListing.images.map((image) => (
                      <div key={image.id} className="relative w-24 h-24">
                        <img
                          src={image.image_url}
                          alt="Existing property"
                          className="w-full h-full object-cover rounded"
                          onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 mt-8">
                <button
                  type="button"
                  onClick={() => setShowAddListingForm(false)}
                  className="px-4 py-2 text-gray-500 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  {newListing.id ? 'Update Listing' : 'Add Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Listings */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Active Listings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {active_listings && active_listings.length > 0 ? (
            active_listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 relative">
                  <img
                    src={listing.images?.[0]?.image_url || '/placeholder.jpg'}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end">
                    <h3 className="text-white font-semibold text-lg">{listing.title}</h3>
                    <p className="text-white/80 text-sm">{listing.formatted_address}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-blue-600">${listing.min_price}/mo</span>
                    <span className="text-sm text-gray-500">Ends {new Date(listing.auction_end_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleEditListing(listing)}
                      className="flex items-center text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteListing(listing.id)}
                      className="flex items-center text-red-500 hover:text-red-700"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">You have no active listings.</p>
          )}
        </div>
      </div>

      {/* Past Listings */}
      {past_listings && past_listings.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Past Listings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {past_listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden opacity-75">
                <div className="h-48 relative">
                  <img
                    src={listing.images?.[0]?.image_url || '/placeholder.jpg'}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end">
                    <div className="bg-red-500 text-white px-2 py-1 rounded text-xs absolute top-2 right-2">
                      Ended
                    </div>
                    <h3 className="text-white font-semibold text-lg">{listing.title}</h3>
                    <p className="text-white/80 text-sm">{listing.formatted_address}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-blue-600">${listing.min_price}/mo</span>
                    <span className="text-sm text-gray-500">Ended {new Date(listing.auction_end_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingsTab; 