import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const BidCard = ({ bid }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="flex justify-between mb-2">
      <h3 className="font-semibold">{bid.property.title}</h3>
      <span className="text-blue-500 font-semibold">${bid.amount}/month</span>
    </div>
    <p className="text-gray-600 mb-2">
      {bid.property.formatted_address}
    </p>
    <div className="text-sm text-gray-500 mb-2">
      <span>Bid placed on {new Date(bid.created_at).toLocaleDateString()}</span>
    </div>
    <div className="flex justify-between items-center text-sm">
      <span className={`px-2 py-1 rounded-full ${
        bid.status === 'accepted' ? 'bg-green-100 text-green-800' : 
        bid.status === 'rejected' ? 'bg-red-100 text-red-800' : 
        'bg-yellow-100 text-yellow-800'
      }`}>
        {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
      </span>
      <button 
        onClick={() => window.location.href = `/listings/${bid.property.id}`}
        className="flex items-center text-blue-500 hover:text-blue-700"
      >
        View Listing <ExternalLink size={14} className="ml-1" />
      </button>
    </div>
  </div>
);

const BidsTab = ({ bids = { active_bids: [], past_bids: [] } }) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Bids</h2>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Active Bids</h3>
        {bids.active_bids && bids.active_bids.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bids.active_bids.map((bid) => (
              <BidCard key={bid.id} bid={bid} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You have no active bids.</p>
        )}
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Past Bids</h3>
        {bids.past_bids && bids.past_bids.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bids.past_bids.map((bid) => (
              <BidCard key={bid.id} bid={bid} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You have no past bids.</p>
        )}
      </div>
    </div>
  );
};

export default BidsTab; 