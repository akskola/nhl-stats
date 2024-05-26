import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import TeamSummary from './components/TeamSummary';
import TeamStats from './components/TeamStats';
import HeroPage from './components/HeroPage';

const App = () => {
    return (
        <Router>
          <Navbar />
            <Routes>
                {/* <Route path="/" element={<TeamSummary />} /> */}
                <Route path="/" exact element={<HeroPage />} />
                <Route path="/summary" element={<TeamSummary />} />
                <Route path="/team/:teamId/season/:seasonId" element={<TeamStats />} />
            </Routes>
        </Router>
    );
};

export default App;


