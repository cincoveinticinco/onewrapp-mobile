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

type SortOption = [string, string, number];

export interface ScenesContextType {
  filterOptions: FilterOptionsInterface;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptionsInterface>>;
  sortOptions: SortOption[];
  setSortOptions: React.Dispatch<React.SetStateAction<SortOption[]>>;
}

const ScenesContext = createContext<ScenesContextType>({
  filterOptions: {},
  setFilterOptions: () => {},
  sortOptions: [],
  setSortOptions: () => {},
});

export const defaultSortOptions: SortOption[] = [['episodeNumber', 'asc', 0], ['sceneNumber', 'asc', 1]];

export const ScenesContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptionsInterface>({});
  const [sortOptions, setSortOptions] = useState<SortOption[]>(() => {
    const savedSortOptions = localStorage.getItem('sortOptions');
    if (savedSortOptions) {
      return JSON.parse(savedSortOptions);
    }
    return defaultSortOptions;
  });

  const contextValue: ScenesContextType = {
    filterOptions,
    setFilterOptions,
    sortOptions,
    setSortOptions,
  };

  const orderSortOptions = (sortOptions: SortOption[]) => {
    sortOptions.sort((a, b) => {
      const aOptionIndex = a[2];
      const bOptionIndex = b[2];
      return bOptionIndex - aOptionIndex;
    });
  };

  useEffect(() => {
    orderSortOptions(sortOptions);
    localStorage.setItem('sortOptions', JSON.stringify(sortOptions)); // Guardar en localStorage
  }, [sortOptions]);

  useEffect(() => {
    console.log('FILTER OPTIONS: useEffect', filterOptions);
  }, [filterOptions]);

  return (
    <ScenesContext.Provider value={contextValue}>
      {children}
    </ScenesContext.Provider>
  );
};

export default ScenesContext;
