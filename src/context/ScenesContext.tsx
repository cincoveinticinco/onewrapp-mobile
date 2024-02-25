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
  castSelectedSortOptions: SortOption[];
  setCastSelectedSortOptions: React.Dispatch<React.SetStateAction<SortOption[]>>;
  setsSelectedSortOptions: SortOption[];
  setSetsSelectedSortOptions: React.Dispatch<React.SetStateAction<SortOption[]>>;
  elementsSelectedSortOptions: SortOption[];
  setElementsSelectedSortOptions: React.Dispatch<React.SetStateAction<SortOption[]>>;
  elementsCategoriesSelectedSortOptions: SortOption[];
  setElementsCategoriesSelectedSortOptions: React.Dispatch<React.SetStateAction<SortOption[]>>;
}

const ScenesContext = createContext<ScenesContextType>({
  selectedFilterOptions: {},
  setSelectedFilterOptions: () => {},
  selectedSortOptions: [],
  setSelectedSortOptions: () => {},
  castSelectedSortOptions: [],
  setCastSelectedSortOptions: () => {},
  setsSelectedSortOptions: [],
  setSetsSelectedSortOptions: () => {},
  elementsSelectedSortOptions: [],
  setElementsSelectedSortOptions: () => {},
  elementsCategoriesSelectedSortOptions: [],
  setElementsCategoriesSelectedSortOptions: () => {},
});

export const defaultSortOptions: SortOption[] = [['sceneNumber', 'asc', 1], ['episodeNumber', 'asc', 0]];
export const castDefaultSortOptions: SortOption[] = [['characterName', 'asc', 1], ['characterNum', 'asc', 0]];
export const setsDefaultSortOptions: SortOption[] = [['setName', 'asc', 0]];
export const elementsDefaultSortOptions: SortOption[] = [['elementName', 'asc', 0]];
export const elementsCategoriesDefaultSortOptions: SortOption[] = [['categoryName', 'asc', 0]];

export const ScenesContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedFilterOptions, setSelectedFilterOptions] = useState<SelectedFilterOptionsInterface>({});
  const [selectedSortOptions, setSelectedSortOptions] = useState<SortOption[]>(() => {
    const savedSortOptions = localStorage.getItem('selectedSortOptions');
    if (savedSortOptions) {
      return JSON.parse(savedSortOptions);
    }
    return defaultSortOptions;
  });

  const [castSelectedSortOptions, setCastSelectedSortOptions] = useState<SortOption[]>(() => {
    const savedSortOptions = localStorage.getItem('castSelectedSortOptions');
    if (savedSortOptions) {
      return JSON.parse(savedSortOptions);
    }
    return castDefaultSortOptions;
  });

  const [setsSelectedSortOptions, setSetsSelectedSortOptions] = useState<SortOption[]>(() => {
    const savedSortOptions = localStorage.getItem('setsSelectedSortOptions');
    if (savedSortOptions) {
      return JSON.parse(savedSortOptions);
    }
    return defaultSortOptions;
  });

  const [elementsSelectedSortOptions, setElementsSelectedSortOptions] = useState<SortOption[]>(() => {
    const savedSortOptions = localStorage.getItem('elementsSelectedSortOptions');
    if (savedSortOptions) {
      return JSON.parse(savedSortOptions);
    }
    return elementsDefaultSortOptions;
  })

  const [elementsCategoriesSelectedSortOptions, setElementsCategoriesSelectedSortOptions] = useState<SortOption[]>(() => {
    const savedSortOptions = localStorage.getItem('elementsCategoriesSelectedSortOptions');
    if (savedSortOptions) {
      return JSON.parse(savedSortOptions);
    }
    return elementsCategoriesDefaultSortOptions;
  })

  const contextValue: ScenesContextType = {
    selectedFilterOptions,
    setSelectedFilterOptions,
    selectedSortOptions,
    setSelectedSortOptions,
    castSelectedSortOptions,
    setCastSelectedSortOptions,
    setsSelectedSortOptions,
    setSetsSelectedSortOptions,
    elementsSelectedSortOptions,
    setElementsSelectedSortOptions,
    elementsCategoriesSelectedSortOptions,
    setElementsCategoriesSelectedSortOptions,
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
    localStorage.setItem('selectedSortOptions', JSON.stringify(selectedSortOptions));
  }, [selectedSortOptions]);

  useEffect(() => {
    orderSortOptions(castSelectedSortOptions);
    localStorage.setItem('castSelectedSortOptions', JSON.stringify(castSelectedSortOptions));
  }, [castSelectedSortOptions]);

  useEffect(() => {
    orderSortOptions(setsSelectedSortOptions);
    localStorage.setItem('setsSelectedSortOptions', JSON.stringify(setsSelectedSortOptions));
  }, [setsSelectedSortOptions]);

  useEffect(() => {
    orderSortOptions(elementsSelectedSortOptions);
    localStorage.setItem('elementsSelectedSortOptions', JSON.stringify(elementsSelectedSortOptions));
  }, [elementsSelectedSortOptions]);

  useEffect(() => {
    orderSortOptions(elementsCategoriesSelectedSortOptions);
    localStorage.setItem('elementsCategoriesSelectedSortOptions', JSON.stringify(elementsCategoriesSelectedSortOptions));
  }, [elementsCategoriesSelectedSortOptions]);

  return (
    <ScenesContext.Provider value={contextValue}>
      {children}
    </ScenesContext.Provider>
  );
};

export default ScenesContext;
