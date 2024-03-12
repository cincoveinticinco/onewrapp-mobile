  import React, {
    useContext, useEffect, useState, useMemo, useRef,
  } from 'react';
  import {
    IonContent,
  } from '@ionic/react';
  import { useLocation } from 'react-router';
  import DatabaseContext from '../../context/database';
  import getUniqueValuesByKey from '../../utils/getUniqueValuesByKey';
  import { SceneTypeEnum } from '../../Ennums/ennums';
  import MainPagesLayout from '../../Layouts/MainPagesLayout/MainPagesLayout';
  import ScrollInfiniteContext from '../../context/ScrollInfiniteContext';
  import useScrollToTop from '../../hooks/useScrollToTop';
  import InputSortModal from '../../components/Shared/InputSortModal/InputSortModal';
  import ScenesContext, { setsDefaultSortOptions } from '../../context/ScenesContext';
  import sortByCriterias from '../../utils/SortScenesUtils/sortByCriterias';
  import SetCard from '../../components/Sets/LocationSetCard';
  import LocationSetCard from '../../components/Sets/LocationSetCard';
  import './Sets.scss'
import removeAccents from '../../utils/removeAccents';

  const Sets: React.FC = () => {
    const { offlineScenes } = useContext(DatabaseContext);
    const { setsSelectedSortOptions, setSetsSelectedSortOptions } = useContext(ScenesContext);
    const [locationsSelectedSortOptions, setLocationsSelectedSortOptions] = useState<any[]>([]);
    const [setsSearchText, setSetsSearchText] = useState('');
    const [sets, setSets] = useState<any>({});
    const [filteredSets, setFilteredSets] = useState<any[]>([]);
    const [filteredLocations, setFilteredLocations] = useState<any[]>([]);
    const [displayedSets, setDisplayedSets] = useState<any>({});
    const [dropDownIsOpen, setDropDownIsOpen] = useState<any>({});
    const [displayedLocations, setDisplayedLocations] = useState<any[]>([]);
    const [dataIsLoading, setDataIsLoading] = useState<boolean>(true);
    const thisPath = useLocation();
    const contentRef = useRef<HTMLIonContentElement>(null);

    useScrollToTop(contentRef, thisPath);

    const defaultSortPosibilitiesOrder = [
      {
        id: 'NAME', label: 'Name', optionKey: 'setName', defaultIndex: 0,
      },
      {
        id: 'SCENES_QUANTITY', label: 'Scenes Quantity', optionKey: 'scenesQuantity', defaultIndex: 3,
      },
      {
        id: 'PROTECTION_QUANTITY', label: 'Protection Quantity', optionKey: 'protectionQuantity', defaultIndex: 4,
      },
      {
        id: 'PAGES_SUM', label: 'Pages Sum', optionKey: 'pagesSum', defaultIndex: 5,
      },
      {
        id: 'ESTIMATED_TIME_SUM', label: 'Estimated Time Sum', optionKey: 'estimatedTimeSum', defaultIndex: 6,
      },
      {
        id: 'EPISODES_QUANTITY', label: 'Episodes Quantity', optionKey: 'episodesQuantity', defaultIndex: 7,
      },
      {
        id: 'PARTICIPATION', label: 'Participation', optionKey: 'participation', defaultIndex: 8,
      },
    ];

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

    }, [setsSelectedSortOptions])
    const processedSets = useMemo(() => {
      const processSet = (setName: string) => {
        const setScenes = offlineScenes.filter((scene: any) => scene._data.setName === setName);
        const charactersLength = setScenes.reduce((acc: number, scene: any) => acc + scene._data.characters.length, 0);
        const scenesQuantity = setScenes.length;
        const protectionQuantity = setScenes.filter((scene: any) => scene._data.sceneType === SceneTypeEnum.PROTECTION).length;
        const pagesSum = setScenes.reduce((acc: number, scene: any) => acc + (scene._data.pages || 0), 0);
        const estimatedTimeSum = setScenes.reduce((acc: number, scene: any) => acc + (scene._data.estimatedSeconds || 0), 0);
        const episodesQuantity = getUniqueValuesByKey(setScenes, 'episodeNumber').length;
        const participation = ((scenesQuantity / offlineScenes.length) * 100).toFixed(2);
        const { locationName } = setScenes[0]._data;

        return {
          setName,
          charactersLength,
          scenesQuantity,
          protectionQuantity,
          pagesSum,
          estimatedTimeSum,
          episodesQuantity,
          participation,
          locationName: locationName || 'NO LOCATION',
        };
      };

      const uniqueSetNames: any[] = getUniqueValuesByKey(offlineScenes, 'setName');
      return sortByCriterias(uniqueSetNames.map(processSet), setsSelectedSortOptions);
    }, [offlineScenes, setsSelectedSortOptions]);

    const processedLocations = useMemo(() => {
      const uniqueLocationNames: any[] = getUniqueValuesByKey(offlineScenes, 'locationName');
    
      const processedLocationsData = uniqueLocationNames.map((locationName: string) => {
        const locationScenes = offlineScenes.filter((scene: any) => scene._data.locationName === locationName);
        const scenesQuantity = locationScenes.length;
        const protectionQuantity = locationScenes.filter((scene: any) => scene._data.sceneType === SceneTypeEnum.PROTECTION).length;
        const pagesSum = locationScenes.reduce((acc: number, scene: any) => acc + (scene._data.pages || 0), 0);
        const estimatedTimeSum = locationScenes.reduce((acc: number, scene: any) => acc + (scene._data.estimatedSeconds || 0), 0);
        const episodesQuantity = getUniqueValuesByKey(locationScenes, 'episodeNumber').length;
        const participation = ((scenesQuantity / offlineScenes.length) * 100).toFixed(2);
    
        return {
          locationName:  locationName.toLowerCase(),
          scenesQuantity,
          protectionQuantity,
          pagesSum,
          estimatedTimeSum,
          episodesQuantity,
          participation
        };
      });
    
      return sortByCriterias(processedLocationsData, locationsSelectedSortOptions);
    }, [offlineScenes, locationsSelectedSortOptions]);

    useEffect(() => {
      const locationSelectedSortOptions = () => {
        const setNameIndex = setsSelectedSortOptions.findIndex((option) => {
          return option.some((option: any) => option === 'setName');
        })

        let newLocationSelectedSortOptions: any[] = []

        setsSelectedSortOptions.forEach((criteria: any, index: number) => {
        

          if(index !== setNameIndex) {
            newLocationSelectedSortOptions.push(criteria)
          } else {
            const newLocationOption = ['locationName', setsSelectedSortOptions[setNameIndex][1], setsSelectedSortOptions[setNameIndex][2]]
            newLocationSelectedSortOptions.push(newLocationOption)
          }
        });

        return newLocationSelectedSortOptions
      }

      setLocationsSelectedSortOptions(locationSelectedSortOptions())
    }, [setsSelectedSortOptions]);

    useEffect(() => {
      const filteredLocations = processedLocations ? processedLocations.filter((location: any) => {
        const normalizedSearchText = removeAccents(setsSearchText.toLowerCase());
        const normalizedLocation = removeAccents(location.locationName.toLowerCase());

        const includesSet = processedSets.some((set: any) => {
          const normalizedSetLocation = removeAccents(set.locationName.toLowerCase());
          const normalizedSetName = removeAccents(set.setName.toLowerCase());

          return normalizedSetLocation === normalizedLocation &&
          normalizedSetName.includes(normalizedSearchText);
        })

        return includesSet || normalizedLocation.includes(normalizedSearchText);
      }) : processedLocations;  
      setFilteredLocations(filteredLocations); 
    }, [processedLocations, setsSearchText]);

    useEffect(() => {
      const filteredSets = setsSearchText === ''
        ? processedSets
        : processedSets.filter((set: any) =>
        removeAccents(set.setName.toLowerCase()).includes(
          removeAccents(setsSearchText.toLowerCase())
        )
          );
      setFilteredSets(filteredSets);
    }, [processedSets, setsSearchText]);

    useEffect(() => {
      if(processedLocations.length > 0 && filteredSets.length > 0) {
        processedLocations.forEach((location: any) => {
          const filteredSetsByLocation = filteredSets.filter((set: any) => set.locationName.toLowerCase() === location.locationName.toLowerCase());

          setSets((prev: any) => ({
            ...prev,
            [location.locationName]: filteredSetsByLocation,
          }));
        });
      }
    }, [processedLocations, filteredSets]);

    useEffect(() => {
      processedLocations &&
      processedLocations.forEach((location: any) => {
        setDropDownIsOpen((prev: any) => ({ ...prev, [location.locationName]: true }));
      });
    }, [processedLocations]);

    useEffect(() => {
      processedLocations &&
      processedLocations.forEach((location: any) => {
        setDisplayedSets((prev: any) => ({ ...prev, [location.locationName]: [] }));
      });
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

    const handleSetDisplayedSets= (location: string, newElements: any[]) => setDisplayedSets((prev: any) => ({ ...prev, [location]: removeDuplicatesFromArray([...newElements]) }));

    const toggleDropDown = (location: string) => setDropDownIsOpen((prev: any) => ({ ...prev, [location]: !prev[location] }));

    const validateLocationExists = (locationName: string, currentLocationName: string) => {
      if (locationName === currentLocationName) {
        return true;
      }
      const normalize = (text: string) => removeAccents(text.toLowerCase());
      
      const locationExists = processedLocations.some((location: any) => normalize(location.locationName) === normalize(locationName));

      return locationExists ? 'Location already exists' : true;
    }

    const validateSetExists = (setName: string, currentSetName: string) => {
      if (setName === currentSetName) {
        return true;
      }

      const normalize = (text: string) => removeAccents(text.toLowerCase());

      const setExists = processedSets.some((set: any) => normalize(set.setName) === normalize(setName));

      return setExists ? 'Set already exists' : true;
    }

    useEffect(() => {
      setDataIsLoading(false);
    },[processedLocations, processedSets]);

    return (
      <>
        <MainPagesLayout
          searchText={setsSearchText}
          setSearchText={setSetsSearchText}
          title="SETS"
          search
          sort
          sortTrigger="sort-sets-modal-trigger"
        >
          <IonContent color="tertiary" fullscreen ref={contentRef}>
            {
              dataIsLoading && (
                <div>Loading...</div>
              )
            }
            {
              !dataIsLoading && (
                <>
                  <ScrollInfiniteContext setDisplayedData={setDisplayedLocations} filteredData={filteredLocations} batchSize={9}>
                    {displayedLocations.map((location, index) => (
                      <div key={'location' + index + location}>
                      { 
                        sets[location.locationName].length > 0 &&
                        <LocationSetCard 
                          location={location} 
                          searchText={setsSearchText}
                          setsQuantity={
                          sets[location.locationName] ? sets[location.locationName].length : 0
                          }
                          onClick={() => toggleDropDown(location.locationName)}
                          isOpen={dropDownIsOpen[location.locationName]}
                          validationFunction={validateLocationExists}
                        />
                      }
                      {
                        <div className='ion-content-scroll-host sets-card-wrapper' >
                          {
                            dropDownIsOpen[location.locationName] &&
                            <ScrollInfiniteContext
                              setDisplayedData={(newElements: any) => handleSetDisplayedSets(location.locationName, newElements)}
                              filteredData={sets[location.locationName] || []}
                              batchSize={9}
                            >
                              {
                                displayedSets[location.locationName] &&
                                displayedSets[location.locationName].map((set: any, index: number) => (
                                <SetCard 
                                  key={index} 
                                  set={set} 
                                  searchText={setsSearchText}
                                  validationFunction={validateSetExists}
                                />
                              ))}
                            </ScrollInfiniteContext>
                          }
                        </div>
                      }
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
