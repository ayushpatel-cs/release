// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.js';
import Header from './components/Header/header.js';
import Homepage from './components/Homepage/homepage.js';
import Search from './components/Search/search.js';
import Listing from './components/Listing/listing.js';
import ListingDetail from './components/Listing/ListingDetail';
import Login from './components/Login/login.js';
import Profile from './components/Profile/profile.js';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/listing" element={<Listing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
