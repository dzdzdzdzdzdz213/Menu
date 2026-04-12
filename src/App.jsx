import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import Navigation from './components/Navigation';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Account from './pages/Account';
import Checkout from './pages/Checkout';
import Delivery from './pages/Delivery';
import Merchants from './pages/Merchants';
import OrderHistory from './pages/OrderHistory';
import Restaurant from './pages/Restaurant';
import Search from './pages/Search';
import { Terms, Privacy } from './pages/Legal';
import NotFound from './pages/NotFound';
import SellerDashboard from './pages/SellerDashboard';
import ProfileSetup from './pages/ProfileSetup';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

function AppInner() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navigation />
        <CartDrawer />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute>
            } />
            <Route path="/seller-dashboard" element={
              <ProtectedRoute requiredRole="seller"><SellerDashboard /></ProtectedRoute>
            } />
            <Route path="/setup-profile" element={
              <ProtectedRoute><ProfileSetup /></ProtectedRoute>
            } />
            <Route path="/account" element={<Account />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/merchants" element={<Merchants />} />
            <Route path="/history" element={<OrderHistory />} />
            <Route path="/restaurant/:id" element={<Restaurant />} />
            <Route path="/search" element={<Search />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppInner />
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
