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
  LogIn,
  LogOut,
  User} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import { useUser } from '../contexts/UserContext';

const NavigationBar = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user } = useUser();
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', to: '/', label: 'Home', icon: Home },
    { id: 'forecast', to: '/forecast', label: 'Forecast', icon: BarChart3 },
    { id: 'alerts', to: '/alerts', label: 'Alerts', icon: AlertCircle },
    {
      id: 'signout',
      label: user ? 'Logout' : 'Login',
      icon: user ? LogOut : LogIn,
      onClick: () => {
        logout();
        navigate('/signin');
      },
    },
  ];

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
            className="fixed top-0 left-0 w-64 h-full bg-gradient-to-b from-emerald-500 to-teal-600 text-white pt-20 px-4 mt-20"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-2 mb-4">
              {navItems.map((item) => (
                item.onClick ? (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ) : (
                  <NavLink
                    to={item.to}
                    key={item.id}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </NavLink>
                )
              ))}
            </nav>
            <div className="mb-4 p-3 bg-white/10 rounded-lg">
              <div className="text-white/80 text-sm mb-2">Language</div>
              <LanguageSelector className="w-full" />
            </div>
            <button onClick={() => navigate('/profile')} className="p-2 rounded-lg hover:bg-white/10">
              <User className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20">
              <Volume2 className="w-4 h-4" />
              <span className="text-sm">Audio Alerts</span>
            </button>
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
            {navItems.map((item) => (
                item.onClick ? (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ) : (
                  <NavLink
                    to={item.to}
                    key={item.id}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </NavLink>
                )
              ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <LanguageSelector className="w-36" />
            <button className="p-2 rounded-lg hover:bg-white/10">
              <Bell className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/profile')} className="p-2 rounded-lg hover:bg-white/10">
              <User className="w-5 h-5" />
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

const BottomNavigation = () => {
  const { logout, user } = useUser();
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', to: '/', label: 'Home', icon: Home },
    { id: 'forecast', to: '/forecast', label: 'Forecast', icon: BarChart3 },
    { id: 'alerts', to: '/alerts', label: 'Alerts', icon: AlertCircle },
    {
      id: 'signout',
      label: user ? 'Logout' : 'Login',
      icon: user ? LogOut : LogIn,
      onClick: () => {
        logout();
        navigate('/signin');
      },
    },
  ]
  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
                item.onClick ? (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ) : (
                  <NavLink
                    to={item.to}
                    key={item.id}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </NavLink>
                )
              ))}
        </div>
      </div>
    </>
);}

export { NavigationBar, BottomNavigation };
