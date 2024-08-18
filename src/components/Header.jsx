import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <header className="header">
      <nav>
        <ul className="nav-list">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><button onClick={toggleSearch} className="search-tab">Search</button></li>
        </ul>
      </nav>
      {isSearchVisible && (
        <div className="search-box">
          <input type="text" placeholder="Search..." />
        </div>
      )}
    </header>
  );
}

export default Header;