import { IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router';

interface ScrollInfiniteContextProps {
  children: React.ReactNode
  setDisplayedData: React.Dispatch<React.SetStateAction<any[]>>
  filteredData: any[]
}

const ScrollInfiniteContext: React.FC<ScrollInfiniteContextProps> = ({ children, setDisplayedData, filteredData }) => {
  const BATCH_SIZE = 10;
  const [currentBatch, setCurrentBatch] = React.useState(0);
  const [isInfiniteDisabled, setInfiniteDisabled] = React.useState(false);

  const loadMoreData = () => {
    if (currentBatch * BATCH_SIZE >= filteredData.length) {
      setInfiniteDisabled(true);
      return;
    }
    const newData = filteredData.slice(0, (currentBatch + 1) * BATCH_SIZE);
    setDisplayedData(newData);
    setCurrentBatch(currentBatch + 1);
  };

  const handleInfinite = (e: CustomEvent<void>) => {
    loadMoreData();
    (e.target as HTMLIonInfiniteScrollElement).complete();
  };

  useEffect(() => {
    setDisplayedData(filteredData.slice(0, BATCH_SIZE));
  }, [filteredData]);

  const thisPath = useLocation();

  useEffect(() => {
    setCurrentBatch(0);
    setDisplayedData(filteredData.slice(0, BATCH_SIZE));
    setInfiniteDisabled(false);
    console.log('CHANGING PATH', currentBatch, thisPath)
  }, [thisPath]);

  useEffect(() => {
    if(filteredData.length > currentBatch * BATCH_SIZE) {
      setInfiniteDisabled(false);
    }
  }, [filteredData])

  return (
    <div>
      {children}
      <IonInfiniteScroll onIonInfinite={handleInfinite} disabled={isInfiniteDisabled} threshold="100px">
        <IonInfiniteScrollContent loadingText="Loading more elements..." />
      </IonInfiniteScroll>
    </div>
  );
};

export default ScrollInfiniteContext;
