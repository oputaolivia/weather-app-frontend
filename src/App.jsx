import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Forecast from './pages/Forecast';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white shadow mb-6">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/" className="font-bold text-green-900 text-xl">FarmWeather</Link>
            <div className="flex gap-4">
              <Link to="/" className="hover:text-green-700">Home</Link>
              <Link to="/forecast" className="hover:text-green-700">Forecast</Link>
              <Link to="/alerts" className="hover:text-green-700">Alerts</Link>
              <Link to="/profile" className="hover:text-green-700">Profile</Link>
              <Link to="/signin" className="hover:text-green-700">Sign In</Link>
            </div>
      </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
