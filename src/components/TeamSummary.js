import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Radar, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';
import { formatSeasonId, normalizeData, generateColor } from './utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import './TeamSummary.css';

ChartJS.register(
    RadialLinearScale,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Filler,
    Tooltip,
    Legend
);

const TeamSummary = () => {
    const [teams, setTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [compareMode, setCompareMode] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'points', direction: 'descending' });

    useEffect(() => {
      setIsLoading(true);
      axios
          .get("/api/nhle/stats/rest/en/team/summary")
          .then((response) => {
              const sortedTeams = response.data.data.sort(
                  (a, b) => b.points - a.points
              );
              setTeams(sortedTeams);
              setSelectedTeams(sortedTeams.slice(0, 2)); // Select top 2 teams by default
          })
          .catch((error) => console.error("Error fetching data:", error))
          .finally(() => {
              setIsLoading(false);
          });
  }, []);
  

    const handleCheckboxChange = (team) => {
        setSelectedTeams((prevSelectedTeams) => {
            if (prevSelectedTeams.some(selectedTeam => selectedTeam.teamId === team.teamId && selectedTeam.seasonId === team.seasonId)) {
                return prevSelectedTeams.filter(selectedTeam => !(selectedTeam.teamId === team.teamId && selectedTeam.seasonId === team.seasonId));
            } else {
                return [...prevSelectedTeams, team];
            }
        });
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedTeams = [...teams].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            if (sortConfig.direction === 'ascending') {
                return faSortUp;
            } else {
                return faSortDown;
            }
        }
        return faSort;
    };

    const keys = ['gamesPlayed', 'goalsFor', 'goalsAgainst', 'wins', 'losses', 'points'];
    const normalizedTeams = normalizeData(selectedTeams, keys);

    const radarOptions = {
        scales: {
            r: {
                angleLines: {
                    color: '#444444'
                },
                grid: {
                    color: '#444444'
                },
                pointLabels: {
                    color: '#a8a8a8'
                },
                ticks: {
                    color: '#444444'
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#a8a8a8'
                }
            }
        }
    };

    const barOptions = {
        scales: {
            x: {
                grid: {
                    color: '#444444'
                },
                ticks: {
                    color: '#a8a8a8'
                }
            },
            y: {
                grid: {
                    color: '#444444'
                },
                ticks: {
                    color: '#a8a8a8'
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#a8a8a8'
                }
            }
        }
    };

    const radarData = {
        labels: ['Games Played', 'Goals For', 'Goals Against', 'Wins', 'Losses', 'Points'],
        datasets: normalizedTeams.map((team, index) => {
            const colors = generateColor(index);
            return {
                label: `${team.teamFullName} (${formatSeasonId(team.seasonId)})`,
                data: [
                    team.gamesPlayed,
                    team.goalsFor,
                    team.goalsAgainst,
                    team.wins,
                    team.losses,
                    team.points,
                ],
                backgroundColor: colors.backgroundColor,
                borderColor: colors.borderColor,
                borderWidth: 1,
            };
        }),
    };

    const barData = {
        labels: ['Games Played', 'Goals For', 'Goals Against', 'Wins', 'Losses', 'Points'],
        datasets: selectedTeams.map((team, index) => {
            const colors = generateColor(index);
            return {
                label: `${team.teamFullName} (${formatSeasonId(team.seasonId)})`,
                data: [
                    team.gamesPlayed,
                    team.goalsFor,
                    team.goalsAgainst,
                    team.wins,
                    team.losses,
                    team.points,
                ],
                backgroundColor: colors.backgroundColor,
                borderColor: colors.borderColor,
                borderWidth: 1,
            };
        }),
    };

    return (
      <div className="summary-container">
        <div className="header">
          <h1>NHL League Summary</h1>
          <label className="switch">
            <input
              type="checkbox"
              checked={compareMode}
              onChange={() => setCompareMode(!compareMode)}
            />
            <span className="slider round"></span>
          </label>
          <span className="toggle-label">Compare Teams</span>
        </div>
        {compareMode && (
          <div className="chart-container">
            <div className="chart">
              <Bar data={barData} options={barOptions} />
              <h3>Bar Chart</h3>
            </div>
            <div className="chart">
              <Radar data={radarData} options={radarOptions} />
              <h3>Normalized Radar Chart</h3>
            </div>
          </div>
        )}
        <table>
          <thead>
            <tr>
              {compareMode && <th>COMPARE</th>}
              <th onClick={() => handleSort("teamFullName")}>
                TEAM <FontAwesomeIcon icon={getSortIcon("teamFullName")} />
              </th>
              <th onClick={() => handleSort("seasonId")}>
                SEASON <FontAwesomeIcon icon={getSortIcon("seasonId")} />
              </th>
              <th onClick={() => handleSort("gamesPlayed")}>
                GAMES PLAYED{" "}
                <FontAwesomeIcon icon={getSortIcon("gamesPlayed")} />
              </th>
              <th onClick={() => handleSort("wins")}>
                WINS <FontAwesomeIcon icon={getSortIcon("wins")} />
              </th>
              <th onClick={() => handleSort("losses")}>
                LOSSES <FontAwesomeIcon icon={getSortIcon("losses")} />
              </th>
              <th onClick={() => handleSort("points")}>
                POINTS <FontAwesomeIcon icon={getSortIcon("points")} />
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <div className='loading-container'>Loading...</div>}
            {sortedTeams.map((team, index) => (
              <tr
                key={`${team.teamId}-${team.seasonId}-${index}`}
                onClick={() =>
                  (window.location.href = `/team/${team.teamId}/season/${team.seasonId}`)
                }
                className="clickable-row"
              >
                {compareMode && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedTeams.some(
                        (selectedTeam) =>
                          selectedTeam.teamId === team.teamId &&
                          selectedTeam.seasonId === team.seasonId
                      )}
                      onChange={() => handleCheckboxChange(team)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}
                <td data-label="Team Name">{team.teamFullName}</td>
                <td data-label="Season">{formatSeasonId(team.seasonId)}</td>
                <td data-label="Games Played">{team.gamesPlayed}</td>
                <td data-label="Wins">{team.wins}</td>
                <td data-label="Losses">{team.losses}</td>
                <td data-label="Points">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
};

export default TeamSummary;
