import { createContext, useContext, useState, } from 'react';
import { getCookie, setCookie, deleteCookie } from '../services/cookies';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = getCookie('weatherAppUser');
    return stored ? JSON.parse(stored) : null;
  });

  const logout = () => {
    setUser(null);
    deleteCookie('weatherAppUser');
  };

  const login = (userData) => {
    setUser(userData);
    setCookie('weatherAppUser', JSON.stringify(userData), 60);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
