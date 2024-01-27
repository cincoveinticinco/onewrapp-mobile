import React, { createContext, useEffect, useState } from 'react';

export interface FilterOptionsInterface {
  sceneType?: string[];
  protectionType?: string[];
  episodeNumber?: string[];
  dayOrNightOption?: string[];
  intOrExtOption?: string[];
  characters?: any[];
  extras?: any[];
  locationName?: string[];
  setName?: string[];
  elements?: any[];
  units?: string[];
  date?: string[];
}

const ScenesFiltersContext = createContext({});

export const ScenesFiltersProvider = ({ children }: { children: React.ReactNode }) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptionsInterface>({});

  const contextValue = {
    filterOptions,
    setFilterOptions,
  };

  useEffect(() => {
    console.log('ScenesFiltersContext: useEffect', filterOptions);
  }, [filterOptions]);

  return (
    <ScenesFiltersContext.Provider value={contextValue}>
      {children}
    </ScenesFiltersContext.Provider>
  );
};

export default ScenesFiltersContext;
