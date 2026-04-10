import React from 'react';
import './Header.css';
import DarkModeToggle from './DarkModeToggle';

function Header() {
  return (
    <header className="header glass">
      <div className="container flex items-center justify-between">
        <h1 className="logo">Menu</h1>
        <nav className="nav-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/about" className="nav-link">About</a>
          <a href="/contact" className="nav-link">Contact</a>
        </nav>
        <DarkModeToggle />
      </div>
    </header>
  );
}

export default Header;
