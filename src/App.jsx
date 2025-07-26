import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Forecast from './pages/Forecast';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import './App.css';
import { NavigationBar, BottomNavigation } from './components/Navbar';
import { useUser } from './contexts/UserContext';

function App() {
  const { user, loading } = useUser();
  if (loading) return null;

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/signin" />;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavigationBar />
        <Routes>
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/forecast" element={<PrivateRoute><Forecast /></PrivateRoute>} />
          <Route path="/alerts" element={<PrivateRoute><Alerts /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
        <BottomNavigation />
      </div>
    </Router>
  );
}

export default App;
