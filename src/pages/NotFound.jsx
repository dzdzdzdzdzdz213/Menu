import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const NotFound = () => {
  const navigate = useNavigate();
  
  useSEO({
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist.',
    url: '/404'
  });

  return (
    <div className="container page-transition" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
      <FileQuestion size={100} className="text-red" style={{ marginBottom: '2rem' }} />
      <h1 className="title-lg" style={{ marginBottom: '1rem' }}>404 - Not Found</h1>
      <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>We couldn't find the page you're looking for.</p>
      <button 
        className="btn-primary" 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} 
        onClick={() => navigate('/')}
      >
        <Home size={18} /> Back to Homepage
      </button>
    </div>
  );
};

export default NotFound;
