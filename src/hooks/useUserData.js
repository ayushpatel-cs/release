import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

export const useUserData = (userId) => {
  const [userData, setUserData] = useState(null);
  const [listings, setListings] = useState({ active_listings: [], past_listings: [] });
  const [bids, setBids] = useState({ active_bids: [], won_bids: [], lost_bids: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const refreshData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      console.log('Fetching user data for ID:', userId);
      console.log('Current user:', user);
      console.log('Current auth token:', localStorage.getItem('token'));

      // Create an array of promises for the API calls
      const promises = [
        api.get(`/users/${userId}`),
        api.get(`/users/${userId}/properties`)
      ];

      // Only fetch bids if user is viewing their own profile
      if (user && user.id === parseInt(userId)) {
        promises.push(api.get(`/users/${userId}/bids`));
      }

      const responses = await Promise.all(promises);
      
      setUserData(responses[0].data);
      setListings(responses[1].data);
      
      // Set bids only if we fetched them
      if (responses[2]) {
        setBids(responses[2].data);
      } else {
        // Set empty bids state when viewing other users' profiles
        setBids({ active_bids: [], won_bids: [], lost_bids: [] });
      }
    } catch (err) {
      console.error('Error in useUserData:', err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [userId, user]);

  return { userData, listings, bids, loading, error, refreshData };
};