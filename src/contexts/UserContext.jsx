import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

// This is to be enable access to user's information after signing-in so as to populate them in the profile page and the Home page for the salutaions.

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); 

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
