import { createContext, useContext, useState } from 'react';
import { getCookie, setCookie, deleteCookie } from '../services/cookies';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = getCookie('weatherAppUser');
    return stored ? JSON.parse(stored) : null;
  });

  const logout = () => {
    deleteCookie('weatherAppUser');
    setUser(null);
  };

  const login = (userData) => {
    deleteCookie('weatherAppUser');
    setCookie('weatherAppUser', JSON.stringify(userData), 60);
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
