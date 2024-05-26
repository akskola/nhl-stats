import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HeroPage.css';
import nhlLogo from '../images/nhl-logo.png'; // Ensure you have the logo image

const HeroPage = () => {

    useEffect(() => {
        const canvas = document.getElementById('backgroundCanvas');
        const ctx = canvas.getContext('2d');
        const lines = [];
        const colors = ['#018786', '#00bfa5', '#02c8a7', '#019a7d'];
        const numLines = 50;

        for (let i = 0; i < numLines; i++) {
            lines.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: Math.random() * 50 + 50,
                angle: Math.random() * 360,
                speed: Math.random() * 1 + 0.5,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            lines.forEach(line => {
                ctx.strokeStyle = line.color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(line.x, line.y);
                ctx.lineTo(
                    line.x + line.length * Math.cos((line.angle * Math.PI) / 180),
                    line.y + line.length * Math.sin((line.angle * Math.PI) / 180)
                );
                ctx.stroke();

                line.x += line.speed * Math.cos((line.angle * Math.PI) / 180);
                line.y += line.speed * Math.sin((line.angle * Math.PI) / 180);

                if (line.x < 0 || line.x > canvas.width || line.y < 0 || line.y > canvas.height) {
                    line.x = Math.random() * canvas.width;
                    line.y = Math.random() * canvas.height;
                }
            });

            requestAnimationFrame(draw);
        };

        draw();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const canvas = document.getElementById('backgroundCanvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleMouseMove = (e) => {
        const canvas = document.getElementById('backgroundCanvas');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        canvas.style.transform = `translate(${(x - rect.width / 2) / 20}px, ${(y - rect.height / 2) / 20}px)`;
    };

    return (
        <div className="hero-container" onMouseMove={handleMouseMove}>
            <canvas id="backgroundCanvas" className="background-canvas"></canvas>
            <div className="hero-content">
                <img src={nhlLogo} alt="NHL Logo" className="hero-logo" />
                <h1>NHL Stats</h1>
                <p>
                    Welcome to NHL Stats, your go-to app for exploring and comparing the latest NHL statistics. Dive into league summary, compare stats, and stay updated with all the latest data.
                </p>
                <div className="hero-buttons">
                    <Link to="/summary">
                        <button className="hero-button">League Summary</button>
                    </Link>
                    <Link to="/team/1/season/20232024">
                        <button className="hero-button hero-button-outline">Team Statistics</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HeroPage;
