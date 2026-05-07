import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import OfficerDashboard from './pages/OfficerDashboard';
import BidderDashboard from './pages/BidderDashboard';
import TenderDetail from './pages/TenderDetail';
import BidEvaluation from './pages/BidEvaluation';
import BidDetails from './pages/BidDetails';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard/officer" element={<OfficerDashboard />} />
        <Route path="/dashboard/bidder" element={<BidderDashboard />} />
        <Route path="/bidder-dashboard" element={<BidderDashboard />} />
        <Route path="/tender/:id" element={<TenderDetail />} />
        <Route path="/tender/:id/bids" element={<BidEvaluation />} />
        <Route path="/bid/:id" element={<BidDetails />} />
        
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
