import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './RegionSelector.css';

const regions = [
  "Algeria",
  "Morocco",
  "Tunisia",
  "Gulf Countries",
  "Europe"
];

const RegionSelector = () => {
  const { country, setCountry } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="region-selector-container">
      <button 
        className="region-btn glass" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <MapPin size={18} className="text-red" />
        <span className="region-name">{country}</span>
        <ChevronDown size={18} className={`chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="region-dropdown glass">
          {regions.map((region) => (
            <button
              key={region}
              className={`region-option ${country === region ? 'selected' : ''}`}
              onClick={() => {
                setCountry(region);
                setIsOpen(false);
              }}
            >
              {region}
              {country === region && <div className="active-dot" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegionSelector;
