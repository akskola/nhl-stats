import React from 'react';
import { Link } from 'react-router-dom';
import './HeroPage.css';
import nhlLogo from '../images/nhl-logo.png'; // Ensure you have the logo image

const HeroPage = () => {
    return (
        <div className="hero-container">
            <div className="hero-content">
                <img src={nhlLogo} alt="NHL Logo" className="hero-logo" />
                <h1>NHL Stats</h1>
                <p>
                    Welcome to NHL Stats, your go-to app for exploring and comparing the latest NHL statistics. Dive into team summaries, compare stats, and stay updated with all the latest data.
                </p>
                <div className="hero-buttons">
                    <Link to="/summary">
                        <button className="hero-button">Team Summary</button>
                    </Link>
                    <Link to="/team/1/season/20232024">
                        <button className="hero-button hero-button-outline">Team Stats</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HeroPage;
