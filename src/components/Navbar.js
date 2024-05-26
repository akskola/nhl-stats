import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../images/nhl-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSearch, faGlobe } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div className="navbar-logo">
                    <img src={logo} alt="NHL Logo" />
                    <span className="navbar-title">NHL STATS</span>
                </div>
                <ul className="navbar-menu">
                    <li><Link to="/">Teams Summary</Link></li>
                    <li><Link to="/team/1/season/20232024">Stats</Link></li>
                    {/* Add more links as needed */}
                </ul>
            </div>
            <div className="navbar-right">
                <FontAwesomeIcon icon={faGlobe} className="icon" />
                <span className="navbar-lang">EN</span>
                <FontAwesomeIcon icon={faUser} className="icon" />
                <FontAwesomeIcon icon={faSearch} className="icon" />
            </div>
        </nav>
    );
};

export default Navbar;
