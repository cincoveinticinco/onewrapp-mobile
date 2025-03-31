import {
  IonContent,
  IonIcon,
} from '@ionic/react';
import React, {
  useContext, useEffect,
  useRef,
  useState,
} from 'react';
import { useHistory, useLocation } from 'react-router';
import MainPagesLayout from '../../Layouts/MainPagesLayout/MainPagesLayout';
import InputSortModal from '../../Shared/Components/inputs/InputSortModal/InputSortModal';
import ScenesContext, { setsDefaultSortOptions } from '../../context/Scenes/Scenes.context';
import ScrollInfiniteContext from '../../context/ScrollInfinite/ScrollInfinite.context';
import useScrollToTop from '../../hooks/utils/useScrollToTop/useScrollToTop';

import LocationSetCard, { Set as SetInterface } from './Components/LocationSetCard/LocationSetCard';
import useProcessedSetsAndLocations from '../../hooks/database/useSets/usePorcessedSetsAndLocations';
import AppLoader from '../../Shared/Components/loaders/AppLoader/AppLoader';
import defaultSortPosibilitiesOrder from '../../Shared/Utils/Cast/SortOptions';
import removeAccents from '../../Shared/Utils/removeAccents';
import './Sets.scss';
import ToolbarButton from '../../Shared/Components/buttons/ToolbarButton/ToolbarButton';
import { swapVerticalOutline } from 'ionicons/icons';

const Sets: React.FC<{
  permissionType?: number | null;
}> = ({
  permissionType,
}) => {
  const {
    processedSets, processedLocations, isLoading, setIsLoading,
  } = useProcessedSetsAndLocations();
  const { setsSelectedSortOptions, setSetsSelectedSortOptions } = useContext(ScenesContext);
  const [setsSearchText, setSetsSearchText] = useState('');
  const [sets, setSets] = useState<any>({});
  const [filteredSets, setFilteredSets] = useState<any[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<any[]>([]);
  const [displayedSets, setDisplayedSets] = useState<any>({});
  const [dropDownIsOpen, setDropDownIsOpen] = useState<any>({});
  const [displayedLocations, setDisplayedLocations] = useState<any[]>([]);
  const thisPath = useLocation();
  const contentRef = useRef<HTMLIonContentElement>(null);

  useScrollToTop(contentRef, thisPath);

  const [setsSortPosibilities, setSetsSortPosibilities] = useState<any[]>(() => {
    const savedSortPosibilities = localStorage.getItem('setsSortPosibilities');
    if (savedSortPosibilities) {
      return JSON.parse(savedSortPosibilities);
    }
    return defaultSortPosibilitiesOrder;
  });

  useEffect(() => {
    localStorage.setItem('setsSortPosibilities', JSON.stringify(setsSortPosibilities));
  }, [setsSortPosibilities]);

  useEffect(() => {
    const filteredLocations = processedLocations ? processedLocations.filter((location: any) => {
      const normalizedSearchText = removeAccents(setsSearchText.toLowerCase());
      const normalizedLocation = removeAccents(location.locationName.toLowerCase());

      const includesSet = processedSets.some((set: any) => {
        const normalizedSetLocation = removeAccents(set.locationName.toLowerCase());
        const normalizedSetName = removeAccents(set.setName.toLowerCase());

        if (location.locationName === 'NO LOCATION') {
          return (!set.locationName || set.locationName == '') && normalizedSetName.includes(normalizedSearchText);
        }

        return normalizedSetLocation === normalizedLocation
          && normalizedSetName.includes(normalizedSearchText);
      });

      return includesSet || normalizedLocation.includes(normalizedSearchText);
    }) : processedLocations;
    setFilteredLocations((filteredLocations));
  }, [processedLocations, setsSearchText]);

  useEffect(() => {
    const filteredSets = setsSearchText === ''
      ? processedSets
      : processedSets.filter((set: any) => removeAccents(set.setName.toLowerCase()).includes(
        removeAccents(setsSearchText.toLowerCase()),
      ));
    setFilteredSets(filteredSets);
  }, [processedSets, setsSearchText]);

  useEffect(() => {
    if (processedLocations.length > 0 && filteredSets.length > 0) {
      processedLocations.forEach((location: any) => {
        const filteredSetsByLocation = filteredSets.filter((set: any) => {
          if (location.locationName === 'NO LOCATION') {
            return !set.locationName;
          }
          return set.locationName === location.locationName;
        });

        setSets((prev: any) => ({
          ...prev,
          [location.locationName]: filteredSetsByLocation,
        }));
      });
    }
  }, [processedLocations, filteredSets]);

  useEffect(() => {
    if (processedLocations) {
      processedLocations.forEach((location: any) => {
        setDropDownIsOpen((prev: any) => ({ ...prev, [location.locationName]: true }));
      });
    }
  }, [processedLocations]);

  useEffect(() => {
    if (processedLocations) {
      processedLocations.forEach((location: any) => {
        setDisplayedSets((prev: any) => ({ ...prev, [location.locationName]: [] }));
      });
    }
  }, [processedLocations]);

  const cleartSortSelections = () => {
    localStorage.removeItem('setsSelectedSortOptions');
    localStorage.removeItem('setsSortPosibilities');
    setSetsSelectedSortOptions(setsDefaultSortOptions);
    setSetsSortPosibilities(defaultSortPosibilitiesOrder);
  };

  const removeDuplicatesFromArray = (array: any[]) => {
    const uniqueSet = new Set(array);
    const uniqueArray = [...uniqueSet];
    return uniqueArray;
  };

  const handleSetDisplayedSets = (location: string, newElements: any[]) => setDisplayedSets((prev: any) => ({ ...prev, [location]: removeDuplicatesFromArray([...newElements]) }));

  const toggleDropDown = (location: string) => setDropDownIsOpen((prev: any) => ({ ...prev, [location]: !prev[location] }));

  const validateLocationExists = (locationName: string, currentLocationName: string) => {
    if (locationName) {
      if (locationName === currentLocationName) {
        return true;
      }
      const normalize = (text: string) => removeAccents(text.toLowerCase());

      const locationExists = processedLocations.some((location: any) => normalize(location.locationName) === normalize(locationName));

      return locationExists ? 'Location already exists' : true;
    }

    return 'Location name is required';
  };

  const validateSetExists = (setName: string, currentSetName: string) => {
    if (setName) {
      if (setName === currentSetName) {
        return true;
      }
      const normalize = (text: string) => removeAccents(text.toLowerCase());

      const setExists = processedSets.some((set: any) => normalize(set.setName) === normalize(setName));

      return setExists ? 'Set already exists' : true;
    }

    return 'Set name is required';
  };

  const SortButton = () => (
    <ToolbarButton
      triggerId="sort-sets-modal-trigger"
      click={() => {}}
      show
      color="light"
    >
      <IonIcon icon={swapVerticalOutline} />
    </ToolbarButton>
  )

  const history = useHistory()
  const handleBack = () => history.push('/my/projects');

  return (
    <>
      <MainPagesLayout
        searchText={setsSearchText}
        setSearchText={setSetsSearchText}
        title="SETS"
        search 
        customButtons={[SortButton]}
        handleBack={handleBack}
      >
        <IonContent color="tertiary" fullscreen ref={contentRef}>
          {
              isLoading && (
                AppLoader()
              )
            }
          {
              !isLoading && (
                <>
                  <ScrollInfiniteContext setDisplayedData={setDisplayedLocations} filteredData={filteredLocations} batchSize={9}>
                    {displayedLocations.map((location) => (
                      <div key={`location${location.locationName}`}>
                        {
                        sets[location.locationName].length > 0
                        && (
                        <LocationSetCard
                          location={location}
                          searchText={setsSearchText}
                          setsQuantity={
                          sets[location.locationName] ? sets[location.locationName].length : 0
                          }
                          onClick={() => toggleDropDown(location.locationName)}
                          isOpen={dropDownIsOpen[location.locationName]}
                          validationFunction={validateLocationExists}
                          setIsLoading={setIsLoading}
                        />
                        )
                      }
                        <div className="ion-content-scroll-host sets-card-wrapper">
                          {
                            dropDownIsOpen[location.locationName]
                            && (
                            <ScrollInfiniteContext
                              setDisplayedData={(newElements: any) => handleSetDisplayedSets(location.locationName, newElements)}
                              filteredData={sets[location.locationName] || []}
                              batchSize={9}
                            >
                              {
                                displayedSets[location.locationName]
                                && displayedSets[location.locationName].map((set: SetInterface) => (
                                  <LocationSetCard
                                    key={`set-card-${set.setName}`}
                                    set={set}
                                    searchText={setsSearchText}
                                    validationFunction={validateSetExists}
                                    permissionType={permissionType}
                                  />
                                ))
                              }
                            </ScrollInfiniteContext>
                            )
                          }
                        </div>
                      </div>
                    ))}
                  </ScrollInfiniteContext>
                </>
              )
            }
        </IonContent>
      </MainPagesLayout>
      <InputSortModal
        pageName="Sort Sets"
        clearSelections={cleartSortSelections}
        modalTrigger="sort-sets-modal-trigger"
        defaultSortOptions={setsDefaultSortOptions}
        selectedSortOptions={setsSelectedSortOptions}
        setSelectedSortOptions={setSetsSelectedSortOptions}
        sortPosibilities={setsSortPosibilities}
        setSortPosibilities={setSetsSortPosibilities}
      />
    </>
  );
};

export default Sets;
