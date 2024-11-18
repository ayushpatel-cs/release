import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function BidModal({ isOpen, onClose, listing, onBidPlaced }) {
  const [bidAmount, setBidAmount] = useState(listing?.min_price || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    // Check if auction has ended
    if (listing.auction_end_date && new Date(listing.auction_end_date) < new Date()) {
      setError('This auction has ended');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post(`/properties/${listing.id}/bids`, {
        amount: parseFloat(bidAmount)
      });
      onBidPlaced(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place bid');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-semibold mb-4">Place a Bid</h3>
        
        <div className="mb-4">
          <p className="text-gray-600">Current Highest Bid</p>
          <p className="text-2xl font-bold">
            ${Math.max(...listing.bids.map(b => b.amount), listing.min_price).toLocaleString()}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Bid Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-2 border rounded-lg"
                min={listing.min_price}
                step="0.01"
                required
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Placing Bid...' : 'Place Bid'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 