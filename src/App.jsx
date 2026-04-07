import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import Navigation from './components/Navigation';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Admin from './pages/Admin';
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
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Home />} />
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
