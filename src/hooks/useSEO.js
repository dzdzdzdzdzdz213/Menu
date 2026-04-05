import { useEffect } from 'react';

export const useSEO = ({ title, description, image = '/favicon.svg', url = '' }) => {
  useEffect(() => {
    // Standard Metadata
    document.title = title ? `${title} | Menu` : 'Menu — Premium Multi-Vendor Food Platform';
    
    const setMeta = (name, content) => {
      if (!content) return;
      let meta = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        // If it doesn't exist, create it
        meta = document.createElement('meta');
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    setMeta('description', description);
    
    // Open Graph
    setMeta('og:title', document.title);
    setMeta('og:description', description);
    setMeta('og:image', image);
    setMeta('og:url', `https://menu.app${url}`);
    
    // Twitter Card
    setMeta('twitter:title', document.title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);
  }, [title, description, image, url]);
};
