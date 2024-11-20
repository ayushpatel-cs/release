import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ListingDetail from './ListingDetail';
import SellerListingDetail from './SellerListingDetail';

const ProtectedListingRoute = () => {
  const { id, userId } = useParams(); // Get listing ID and userId from URL
  const { user } = useAuth(); // Get the current authenticated user

  // Check if the user in the URL matches the authenticated user
//   if (user && user.id.toString() === userId) {
    return <SellerListingDetail listingId={id} />;
//   }
  // Otherwise, show the public ListingDetail
  return <ListingDetail listingId={id} />;
};

export default ProtectedListingRoute;
