import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';
import TrackTicket from './pages/TrackTicket';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default redirect to Track / Create Ticket */}
        <Route path="/" element={<Navigate to="/track" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/create-ticket" element={<CreateTicket />} />
        <Route path="/track" element={<TrackTicket />} /> {/* Naya Route */}

        {/* Protected Routes (Admin Panel) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ticket/:id" 
          element={
            <ProtectedRoute>
              <TicketDetail />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/track" replace />} />
      </Routes>
    </Router>
  );
}

export default App;