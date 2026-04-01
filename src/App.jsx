import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Heritage from './pages/Heritage';
import Merchants from './pages/Merchants';
import Delivery from './pages/Delivery';
import Search from './pages/Search';
import Account from './pages/Account';
import Restaurant from './pages/Restaurant';
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
            <Route path="/heritage" element={<Heritage />} />
            <Route path="/merchants" element={
              <ProtectedRoute>
                <Merchants />
              </ProtectedRoute>
            } />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/search" element={<Search />} />
            <Route path="/account" element={<Account />} />
            <Route path="/restaurant/:id" element={<Restaurant />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}

export default App;
