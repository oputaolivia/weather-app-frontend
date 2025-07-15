import React, { useState } from 'react';
import {
  Home,
  BarChart3,
  Calendar,
  Users,
  Bell,
  Volume2,
  Menu,
  X,
  Cloud,
  AlertCircle,
  LogIn} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { id: 'home', to: '/', label: 'Home', icon: Home },
  { id: 'forecast', to: '/forecast', label: 'Forecast', icon: BarChart3 },
  { id: 'alerts', to: '/alerts', label: 'Alerts', icon: AlertCircle },
  { id: 'signin', to: '/signin', label: 'Sign In', icon: LogIn },
];

const NavigationBar = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-6 h-6" />
            <span className="font-bold text-lg">FarmWeather</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-white/10"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        <p className="text-sm mt-1 text-white/90">Kano, Nigeria</p>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="fixed top-0 left-0 w-64 h-full bg-gradient-to-b from-emerald-500 to-teal-600 text-white pt-20 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-2">
              {navItems.map(({ id, label, icon: Icon, to }) => (
                <NavLink
                  key={id}
                  to={to}
                  onClick={() => {
                    setActiveTab(id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      <div className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-4">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Cloud className="w-8 h-8" />
            <div>
              <h1 className="font-bold text-xl">FarmWeather</h1>
              <p className="text-sm text-white/90">Kano, Nigeria</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 items-center">
            {navItems.map(({ id, to, label, icon: Icon }) => (
              <NavLink
                key={id}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive ? 'bg-white/20 text-emerald-600' : 'hover:bg-white/10'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {label}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-white/10">
              <Bell className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20">
              <Volume2 className="w-4 h-4" />
              <span className="text-sm">Audio Alerts</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const BottomNavigation = () => (
  <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 px-4 py-2 z-50">
    <div className="flex items-center justify-around">
      {navItems.map(({ id, to, label, icon: Icon }) => (
        <NavLink
          key={id}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              isActive ? 'text-emerald-600' : 'text-gray-500'
            }`
          }
        >
          <Icon className="w-5 h-5 mb-1" />
          <span className="text-xs">{label}</span>
        </NavLink>
      ))}
    </div>
  </div>
);

export { NavigationBar, BottomNavigation };
