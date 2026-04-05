import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Footer.css';

const COUNTRIES = ['Algeria', 'Morocco', 'Tunisia', 'Gulf Countries', 'Europe'];
const LANGUAGES = [
  { code: 'en', label: 'English', native: 'EN' },
  { code: 'fr', label: 'Français', native: 'FR' },
  { code: 'ar', label: 'العربية', native: 'AR' },
];

const Footer = () => {
  const { t, lang, setLang, country, setCountry } = useApp();

  return (
    <footer className="footer glass">
      <div className="footer-main container">
        <div className="footer-brand">
          <h2 className="footer-logo">Menu<span className="text-red">.</span></h2>
          <p className="text-muted footer-desc">{t.footerDesc}</p>
        </div>

        <div className="footer-links">
          <h4>{t.quickLinks}</h4>
          <NavLink to="/">{t.home}</NavLink>
          <NavLink to="/heritage">{t.heritage}</NavLink>
          <NavLink to="/merchants">{t.merchants}</NavLink>
          <NavLink to="/delivery">{t.delivery}</NavLink>
        </div>


      </div>

      <div className="footer-bottom container">
        <p className="text-muted">© {new Date().getFullYear()} Menu. {t.footerRights}</p>
      </div>
    </footer>
  );
};

export default Footer;
