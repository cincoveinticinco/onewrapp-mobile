import React, { createContext, useState } from 'react';

const ScenesFiltersContext = createContext({});

export const ScenesFiltersProvider = ({ children }: { children: React.ReactNode }) => {
  const [filterOptions, setFilterOptions] = useState({});

  const contextValue = {
    filterOptions,
    setFilterOptions,
  };

  return (
    <ScenesFiltersContext.Provider value={contextValue}>
      {children}
    </ScenesFiltersContext.Provider>
  );
};

export default ScenesFiltersContext;
