import { useState, useEffect } from 'react';
import api from '../utils/api';

export const useUserData = (userId) => {
  const [userData, setUserData] = useState(null);
  const [listings, setListings] = useState({ active_listings: [], past_listings: [] });
  const [bids, setBids] = useState({ active_bids: [], won_bids: [], lost_bids: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const [userResponse, listingsResponse, bidsResponse] = await Promise.all([
        api.get(`/users/${userId}`),
        api.get(`/users/${userId}/properties`),
        api.get(`/users/${userId}/bids`)
      ]);

      setUserData(userResponse.data);
      setListings(listingsResponse.data);
      setBids(bidsResponse.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [userId]);

  return { userData, listings, bids, loading, error, refreshData };
};