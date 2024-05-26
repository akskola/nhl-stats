export const formatSeasonId = (seasonId) => {
    const seasonStr = seasonId.toString();
    const startYear = seasonStr.slice(0, 4);
    const endYear = seasonStr.slice(6, 8);
    return `${startYear}-${endYear}`;
};

export const normalizeData = (teams, keys) => {
    const maxValues = {};
    keys.forEach(key => {
        maxValues[key] = Math.max(...teams.map(team => team[key] || 0));
    });

    return teams.map(team => {
        const normalizedTeam = { ...team };
        keys.forEach(key => {
            normalizedTeam[key] = (team[key] || 0) / maxValues[key];
        });
        return normalizedTeam;
    });
};

export const generateColor = (index) => {
    const colors = [
        'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)',
        'rgba(99, 255, 132, 0.2)', 'rgba(162, 54, 235, 0.2)',
        'rgba(206, 255, 86, 0.2)', 'rgba(192, 75, 192, 0.2)',
        'rgba(102, 153, 255, 0.2)', 'rgba(159, 255, 64, 0.2)'
    ];
    const borderColors = [
        'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)',
        'rgba(99, 255, 132, 1)', 'rgba(162, 54, 235, 1)',
        'rgba(206, 255, 86, 1)', 'rgba(192, 75, 192, 1)',
        'rgba(102, 153, 255, 1)', 'rgba(159, 255, 64, 1)'
    ];

    return {
        backgroundColor: colors[index % colors.length],
        borderColor: borderColors[index % borderColors.length]
    };
};
