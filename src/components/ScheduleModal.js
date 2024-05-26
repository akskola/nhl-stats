import React from 'react';
import './ScheduleModal.css';

const ScheduleModal = ({ teamName, season, schedule, onClose }) => {
    const formatDate = (dateString) => {
        const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };
    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>{teamName} {season} Schedule</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div className="modal-content">
                    {schedule ? (
                        <ul className="schedule-list">
                            {schedule.map(game => (
                                <li key={game.id} className="schedule-item">
                                    <div className="game-info">
                                        <div className="team">
                                            <img className="team-logo" src={game.homeTeam.logo} alt={`${game.homeTeam.placeName.default} logo`} />
                                            <p className="team-name">{game.homeTeam.placeName.default}</p>
                                        </div>
                                        <p className="vs-text">vs</p>
                                        <div className="team">
                                            <img className="team-logo" src={game.awayTeam.logo} alt={`${game.awayTeam.placeName.default} logo`} />
                                            <p className="team-name">{game.awayTeam.placeName.default}</p>
                                        </div>
                                    </div>
                                    <div className="game-details">
                                        <p>Date: {formatDate(game.gameDate)}</p>
                                        <p>Time: {new Date(game.startTimeUTC).toLocaleTimeString()}</p>
                                        <p>Venue: {game.venue.default}</p>
                                        <p>Score: {game.homeTeam.score} - {game.awayTeam.score}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div >Loading schedule...</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScheduleModal;
