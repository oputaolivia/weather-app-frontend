import { createContext, useContext, useState, useEffect } from 'react';
import { getCookie, setCookie, deleteCookie } from '../services/cookies';
import { getUser } from '../services/userService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookie = getCookie('weatherAppUser');
    if (cookie) {
      const parsed = JSON.parse(cookie);
      const token = parsed?.token || parsed?.token;

      if (token) {
        getUser(token)
          .then((userData) => {
            setUser(userData); // Or normalize here
            setLoading(false);
          })
          .catch(() => {
            setUser(null);
            setLoading(false);
          });
      } else {
        setUser(null);
        setLoading(false);
      }
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setCookie('weatherAppUser', JSON.stringify(userData), 60); // minutes
    setUser(userData);
  };

  const logout = () => {
    deleteCookie('weatherAppUser');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
