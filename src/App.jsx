import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
const Home = React.lazy(() => import('./pages/Home'));
const Heritage = React.lazy(() => import('./pages/Heritage'));
const Merchants = React.lazy(() => import('./pages/Merchants'));
const Delivery = React.lazy(() => import('./pages/Delivery'));
const Search = React.lazy(() => import('./pages/Search'));
const Account = React.lazy(() => import('./pages/Account'));
const Restaurant = React.lazy(() => import('./pages/Restaurant'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const OrderHistory = React.lazy(() => import('./pages/OrderHistory'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function AppInner() {
  return (
    <ErrorBoundary>
      <Router>
      <div className="app-wrapper">
        <Navigation />
        <CartDrawer />
        <main>
          <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', fontSize: '1.2rem', color: '#666' }}>Loading...</div>}>
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
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="/history" element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#18181C', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      </div>
    </Router>
    </ErrorBoundary>
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
