import React, { createContext, useEffect, useState } from 'react';

export interface SelectedFilterOptionsInterface {
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
  selectedFilterOptions: SelectedFilterOptionsInterface;
  setSelectedFilterOptions: React.Dispatch<React.SetStateAction<SelectedFilterOptionsInterface>>;
  selectedSortOptions: SortOption[];
  setSelectedSortOptions: React.Dispatch<React.SetStateAction<SortOption[]>>;
}

const ScenesContext = createContext<ScenesContextType>({
  selectedFilterOptions: {},
  setSelectedFilterOptions: () => {},
  selectedSortOptions: [],
  setSelectedSortOptions: () => {},
});

export const defaultSortOptions: SortOption[] = [['episodeNumber', 'asc', 0], ['sceneNumber', 'asc', 1]];

export const ScenesContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedFilterOptions, setSelectedFilterOptions] = useState<SelectedFilterOptionsInterface>({});
  const [selectedSortOptions, setSelectedSortOptions] = useState<SortOption[]>(() => {
    const savedSortOptions = localStorage.getItem('selectedSortOptions');
    if (savedSortOptions) {
      return JSON.parse(savedSortOptions);
    }
    return defaultSortOptions;
  });

  const contextValue: ScenesContextType = {
    selectedFilterOptions,
    setSelectedFilterOptions,
    selectedSortOptions,
    setSelectedSortOptions,
  };

  const orderSortOptions = (selectedSortOptions: SortOption[]) => {
    selectedSortOptions.sort((a, b) => {
      const aOptionIndex = a[2];
      const bOptionIndex = b[2];
      return bOptionIndex - aOptionIndex;
    });
  };

  useEffect(() => {
    orderSortOptions(selectedSortOptions);
    localStorage.setItem('selectedSortOptions', JSON.stringify(selectedSortOptions)); // Guardar en localStorage
  }, [selectedSortOptions]);

  useEffect(() => {
    console.log('SELECTED FILTERS', selectedFilterOptions);
  }, [selectedFilterOptions]);

  return (
    <ScenesContext.Provider value={contextValue}>
      {children}
    </ScenesContext.Provider>
  );
};

export default ScenesContext;
