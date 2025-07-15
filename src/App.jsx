import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Forecast from './pages/Forecast';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import './App.css';
import { NavigationBar, BottomNavigation } from './components/Navbar';

function App() {

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
      <NavigationBar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
        <BottomNavigation />

      </div>
    </Router>
  );
}

export default App;
