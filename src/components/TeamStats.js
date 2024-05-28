import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { teamAbbreviations, teamNames } from './teamAbbreviations';
import './TeamStats.css';
import { formatSeasonId } from './utils';
import ScheduleModal from './ScheduleModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const seasons = [
    '20232024', '20222023', '20212022', '20202021', '20192020', '20182019', '20172018', '20162017',
    '20152016', '20142015', '20132014', '20122013', '20112012', '20102011', '20092010', '20082009',
    '20072008', '20062007', '20052006', '20042005', '20032004', '20022003', '20012002', '20002001',
    '19992000', '19981999', '19971998', '19961997', '19951996', '19941995', '19931994', '19921993',
    '19911992', '19901991', '19891990', '19881989', '19871988', '19861987', '19851986', '19841985',
    '19831984', '19821983', '19811982', '19801981', '19791980', '19781979', '19771978', '19761977',
    '19751976', '19741975', '19731974', '19721973', '19711972', '19701971', '19691970', '19681969',
    '19671968', '19661967', '19651966', '19641965', '19631964', '19621963', '19611962', '19601961',
    '19591960', '19581959', '19571958', '19561957', '19551956', '19541955', '19531954', '19521953',
    '19511952', '19501951', '19491950', '19481949', '19471948', '19461947', '19451946', '19441945',
    '19431944', '19421943', '19411942', '19401941', '19391940', '19381939', '19371938', '19361937',
    '19351936', '19341935', '19331934', '19321933', '19311932', '19301931', '19291930', '19281929',
    '19271928', '19261927', '19251926', '19241925', '19231924', '19221923', '19211922', '19201921'
];

const gameTypes = [
    { value: 2, label: 'Regular Season' },
    { value: 3, label: 'Playoffs' },
];

const TeamStats = () => {
    const { teamId, seasonId } = useParams();
    const [selectedSeason, setSelectedSeason] = useState(seasonId || seasons[0]);
    const [teamStats, setTeamStats] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(teamAbbreviations[teamId] || 'TOR');
    const [selectedGameType, setSelectedGameType] = useState(gameTypes[0].value);
    const [showModal, setShowModal] = useState(false);
    const [schedule, setSchedule] = useState(null);
    const [viewAs, setViewAs] = useState('grid');

    useEffect(() => {
        if (selectedTeam) {
            axios.get(`/api-web/nhle/v1/club-stats/${selectedTeam}/${selectedSeason}/${selectedGameType}`)
                .then(response => {
                    setTeamStats(response.data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    toast.error('Error fetching team stats. Please try again later.');
                });
        }
    }, [selectedTeam, selectedSeason, selectedGameType]);

    useEffect(() => {
        if (showModal && selectedTeam && selectedSeason) {
            axios.get(`/api-web/nhle/v1/club-schedule-season/${selectedTeam}/${selectedSeason}`)
                .then(response => {
                    setSchedule(response.data.games);
                })
                .catch(error => {
                    console.error('Error fetching schedule:', error);
                    toast.error('Error fetching schedule. Please try again later.');
                });
        }
    }, [showModal, selectedTeam, selectedSeason]);

    if (!teamStats) return <div className="team-stats-container">Loading...</div>;

    const selectedTeamName = Object.keys(teamAbbreviations).find(key => teamAbbreviations[key] === selectedTeam);

    const sortedTeamNames = Object.keys(teamAbbreviations).sort((a, b) => teamNames[a].localeCompare(teamNames[b]));

    return (
        <div className="team-stats-container">
            <ToastContainer theme="dark" />
            <h1>{`${teamNames[selectedTeamName]} ${formatSeasonId(selectedSeason)} Season Stats`}</h1>
            <div className="dropdown-container">
                <select value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)}>
                    {sortedTeamNames.map(id => (
                        <option key={id} value={teamAbbreviations[id]}>{teamNames[id]}</option>
                    ))}
                </select>
                <select value={selectedSeason} onChange={e => setSelectedSeason(e.target.value)}>
                    {seasons.map(season => (
                        <option key={season} value={season}>
                            {`${formatSeasonId(season)}`}
                        </option>
                    ))}
                </select>
                <select value={selectedGameType} onChange={e => setSelectedGameType(e.target.value)}>
                    {gameTypes.map(gameType => (
                        <option key={gameType.value} value={gameType.value}>
                            {gameType.label}
                        </option>
                    ))}
                </select>
                <select value={viewAs} onChange={e => setViewAs(e.target.value)}>
                    <option value="grid">Grid View</option>
                    <option value="table">Table View</option>
                </select>
            </div>
            <div className="buttons-container">
                <Link to="/summary">
                    <button className='btn-stats'>Back to Summary</button>
                </Link>
                <button className='btn-stats' onClick={() => setShowModal(true)}>Show Schedule</button>
            </div>
            {teamStats.skaters.length === 0 && teamStats.goalies.length === 0 ? (
                <div className="no-data">No Data Available</div>
            ) : (
                <>
                    {viewAs === 'grid' ? (
                        <>
                        <div className='skaters-container'>
                            <h2 className='player-type'>Skaters</h2>
                            <ul className="player-list">
                                {teamStats.skaters.map((player, index) => (
                                    
                                        <a href={`https://www.google.com/search?q=${player.firstName.default}+${player.lastName.default}+ice+hockey`} target="_blank" rel="noopener noreferrer">
                                            <li key={`${player.playerId}-${index}`} className="player-item">
                                            <img src={player.headshot} alt={`${player.firstName.default} ${player.lastName.default}`} />
                                            <div className="player-info">
                                                <p className="player-name">{player.firstName.default} {player.lastName.default}</p>
                                                <p>Games Played: {player.gamesPlayed}</p>
                                                <p>Goals: {player.goals}</p>
                                                <p>Assists: {player.assists}</p>
                                                <p>Points: {player.points}</p>
                                                <p>Plus/Minus: {player.plusMinus || 'N/A'}</p>
                                                <p>Penalty Minutes: {player.penaltyMinutes}</p>
                                            </div>
                                            </li>
                                        </a>
                                    
                                ))}
                            </ul>
                        </div>
                        <div className='goalies-container'>
                            <h2 className='player-type'>Goalies</h2>
                            <ul className="player-list">
                                {teamStats.goalies.map((player, index) => (
                                    <li key={`${player.playerId}-${index}`} className="player-item">
                                        <a href={`https://www.google.com/search?q=${player.firstName.default}+${player.lastName.default}+ice+hockey`} target="_blank" rel="noopener noreferrer">
                                            <img src={player.headshot} alt={`${player.firstName.default} ${player.lastName.default}`} />
                                            <div className="player-info">
                                                <p className="player-name">{player.firstName.default} {player.lastName.default}</p>
                                                <p>Games Played: {player.gamesPlayed}</p>
                                                {player.savePercentage !== undefined && (
                                                    <p>Save Percentage: {(player.savePercentage * 100).toFixed(2)}%</p>
                                                )}
                                                {player.goalsAgainstAverage !== undefined && (
                                                    <p>Goals Against Average: {player.goalsAgainstAverage.toFixed(2)}</p>
                                                )}
                                                <p>Shutouts: {player.shutouts}</p>
                                                <p>Wins: {player.wins}</p>
                                                <p>Losses: {player.losses}</p>
                                            </div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                    
                    ) : (
                        <>
                            <div className='skaters-container'>
                                <h2 className='player-type'>Skaters</h2>
                                <table className="player-table">
                                    <thead>
                                        <tr>
                                            <th>Player</th>
                                            <th>Games Played</th>
                                            <th>Goals</th>
                                            <th>Assists</th>
                                            <th>Points</th>
                                            <th>Plus/Minus</th>
                                            <th>Penalty Minutes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teamStats.skaters.map((player, index) => (
                                            <tr key={`${player.playerId}-${index}`}>
                                                <td><img src={player.headshot} alt={`${player.firstName.default} ${player.lastName.default}`} className="player-headshot" /> {player.firstName.default} {player.lastName.default}</td>
                                                <td>{player.gamesPlayed}</td>
                                                <td>{player.goals}</td>
                                                <td>{player.assists}</td>
                                                <td>{player.points}</td>
                                                <td>{player.plusMinus || 'N/A'}</td>
                                                <td>{player.penaltyMinutes}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className='goalies-container'>
                                <h2 className='player-type'>Goalies</h2>
                                <table className="player-table">
                                    <thead>
                                        <tr>
                                            <th>Player</th>
                                            <th>Games Played</th>
                                            <th>Save Percentage</th>
                                            <th>Goals Against Average</th>
                                            <th>Shutouts</th>
                                            <th>Wins</th>
                                            <th>Losses</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teamStats.goalies.map((player, index) => (
                                            <tr key={`${player.playerId}-${index}`}>
                                                <td><img src={player.headshot} alt={`${player.firstName.default} ${player.lastName.default}`} className="player-headshot" /> {player.firstName.default} {player.lastName.default}</td>
                                                <td>{player.gamesPlayed}</td>
                                                <td>{(player.savePercentage * 100).toFixed(2)}%</td>
                                                <td>{player.goalsAgainstAverage.toFixed(2)}</td>
                                                <td>{player.shutouts}</td>
                                                <td>{player.wins}</td>
                                                <td>{player.losses}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </>
            )}
            {showModal && (
                <ScheduleModal
                    teamName={teamNames[selectedTeamName]}
                    season={formatSeasonId(selectedSeason)}
                    schedule={schedule}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default TeamStats;
