import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menu, X, Home, CloudSun, AlertCircle, User, LogIn } from 'lucide-react';

import '../App.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-green-900 font-bold text-xl flex items-center gap-1">
          <CloudSun className="w-6 h-6 text-green-700" /> FarmWeather
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 items-center">
          <NavLink icon={<Home size={16} />} to="/" label="Home" />
          <NavLink icon={<CloudSun size={16} />} to="/forecast" label="Forecast" />
          <NavLink icon={<AlertCircle size={16} />} to="/alerts" label="Alerts" />
          <NavLink icon={<User size={16} />} to="/profile" label="Profile" />
          <NavLink icon={<LogIn size={16} />} to="/signin" label="Sign In" />
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden focus:outline-none">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-white ${
          isOpen ? 'max-h-96 py-2' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col gap-3 px-4">
          <NavLink icon={<Home size={16} />} to="/" label="Home" />
          <NavLink icon={<CloudSun size={16} />} to="/forecast" label="Forecast" />
          <NavLink icon={<AlertCircle size={16} />} to="/alerts" label="Alerts" />
          <NavLink icon={<User size={16} />} to="/profile" label="Profile" />
          <NavLink icon={<LogIn size={16} />} to="/signin" label="Sign In" />
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, label, icon }) {
  return (
    <Link to={to} className="flex items-center gap-2 text-gray-700 hover:text-green-700 transition-colors">
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export default Navbar;
