import React, { createContext, useState, useContext } from 'react';

const GithubProfileContext = createContext();

export const useGithubProfile = () => useContext(GithubProfileContext);

export const GithubProfileProvider = ({ children }) => {
  const [selectedGithubId, setSelectedGithubId] = useState(null);

  return (
    <GithubProfileContext.Provider value={{ selectedGithubId, setSelectedGithubId }}>
      {children}
    </GithubProfileContext.Provider>
  );
};
