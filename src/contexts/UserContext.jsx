import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCookie, setCookie, deleteCookie } from '../services/cookies';
import { getUser } from '../services/userService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cookie = getCookie('weatherAppUser')
    if (!cookie) {
      setLoading(false)
      return;
    }
    const {token} = JSON.parse(cookie).data;
    if (!token) {
      setLoading(false)
      return;
    }

    const fetchUser = async () => {
      try {
        const userDetails = await getUser(token);
        setUser(userDetails);
      } catch (err) {
        console.error('Failed to fetch user details:', err);
        deleteCookie('weatherAppUser');
      } finally{
        setLoading(false)
      }
    }
    fetchUser();
  }, []);

  const logout = () => {
    deleteCookie('weatherAppUser');
    setUser(null);
  };

  const login = async (authData) => {
    try {
      const token = authData?.data?.token;
      if (!token) throw new Error("Invalid token in login data");

      setCookie('weatherAppUser', JSON.stringify(authData), 60);
      const userDetails = await getUser(token);
      setUser(userDetails);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
