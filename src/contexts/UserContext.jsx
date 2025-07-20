import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getCookie, setCookie, deleteCookie } from '../services/cookies';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = getCookie('weatherAppUser');
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getCookie('weatherAppUser');
    if (storedUser) setUser(storedUser);
    setLoading(false);
  }, []);

  const logout = () => {
    setUser(null);
    deleteCookie('weatherAppUser');
    console.log(user)
  };

  const login = (userData) => {
    setUser(userData);
    setCookie('weatherAppUser', JSON.stringify(userData), 60);
  };

  const hiddenTimeRef = useRef(null);
  const MAX_HIDDEN_DURATION = 60 * 60 * 1000;

  useEffect(() => {
    if (!user) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        hiddenTimeRef.current = Date.now();
      } else if (document.visibilityState === 'visible') {
        const now = Date.now();
        if (
          hiddenTimeRef.current &&
          now - hiddenTimeRef.current > MAX_HIDDEN_DURATION
        ) {
          logout();
        }
        hiddenTimeRef.current = null;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser: login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
