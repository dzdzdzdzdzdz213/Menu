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

        <div className="footer-selectors">
          <div className="selector-group">
            <label className="selector-label text-muted">{t.selectCountry}</label>
            <div className="custom-select-wrap">
              <select
                id="footer-country-select"
                className="custom-select"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                {COUNTRIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <span className="select-arrow">▾</span>
            </div>
          </div>

          <div className="selector-group">
            <label className="selector-label text-muted">{t.selectLanguage}</label>
            <div className="lang-btns">
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  id={`lang-btn-${l.code}`}
                  className={`lang-btn ${lang === l.code ? 'active' : ''}`}
                  onClick={() => setLang(l.code)}
                  title={l.label}
                >
                  {l.native}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom container">
        <p className="text-muted">© {new Date().getFullYear()} Menu. {t.footerRights}</p>
      </div>
    </footer>
  );
};

export default Footer;
