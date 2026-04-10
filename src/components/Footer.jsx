import React from 'react';
import { NavLink } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Linkedin, Globe, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer glass">
      <div className="footer-main container">
        <div className="footer-brand">
          <h2 className="footer-logo">Menu<span className="text-red">.</span></h2>
          <p className="text-muted footer-desc">
            The world's first premium multi-vendor gastronomy aggregator, delivering culinary excellence across the Mediterranean.
          </p>
          <div className="footer-socials">
             <Instagram size={20} className="social-icon" />
             <Facebook size={20} className="social-icon" />
             <Twitter size={20} className="social-icon" />
             <Linkedin size={20} className="social-icon" />
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            <h4>Company</h4>
            <NavLink to="/">About Us</NavLink>
            <NavLink to="/">Careers</NavLink>
            <NavLink to="/">Partner with Us</NavLink>
            <NavLink to="/merchants">Merchant Portal</NavLink>
          </div>
          
          <div className="footer-col">
            <h4>Support</h4>
            <NavLink to="/">Help Center</NavLink>
            <NavLink to="/">Contact Support</NavLink>
            <NavLink to="/delivery">Delivery Info</NavLink>
            <NavLink to="/">FAQ</NavLink>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <NavLink to="/terms">Terms of Service</NavLink>
            <NavLink to="/privacy">Privacy Policy</NavLink>
            <NavLink to="/terms">Cookie Policy</NavLink>
          </div>
        </div>
      </div>

      <div className="footer-bottom container">
        <div className="footer-bottom-left">
          <p className="text-muted">© {new Date().getFullYear()} Menu Platform. All rights reserved.</p>
        </div>
        <div className="footer-bottom-right">
          <div className="footer-meta-item">
            <Globe size={14} /> <span>Algeria (EN)</span>
          </div>
          <div className="footer-meta-item">
            <MapPin size={14} /> <span>Algiers, DZ</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
