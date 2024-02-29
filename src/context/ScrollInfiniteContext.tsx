import { IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router';

interface ScrollInfiniteContextProps {
  children: React.ReactNode
  setDisplayedData: any
  filteredData: any[]
  batchSize?: number
}

const BATCH_SIZE = 15;

const ScrollInfiniteContext: React.FC<ScrollInfiniteContextProps> = ({ children, setDisplayedData, filteredData, batchSize = BATCH_SIZE }) => {
  const [currentBatch, setCurrentBatch] = React.useState(0);
  const [isInfiniteDisabled, setInfiniteDisabled] = React.useState(false);

  const loadMoreData = () => {
    if (currentBatch * batchSize >= filteredData.length) {
      setInfiniteDisabled(true);
      return;
    }
    const newData = filteredData.slice(0, (currentBatch + 1) * batchSize);
    setDisplayedData(newData);
    setCurrentBatch(currentBatch + 1);
  };

  const handleInfinite = (e: CustomEvent<void>) => {
    loadMoreData();
        (e.target as HTMLIonInfiniteScrollElement).complete();
  };

  useEffect(() => {
    setDisplayedData(filteredData.slice(0, batchSize));
  }, [filteredData]);

  const thisPath = useLocation();

  useEffect(() => {
    setCurrentBatch(0);
    setDisplayedData(filteredData.slice(0, batchSize));
    setInfiniteDisabled(false);
  }, [thisPath]);

  useEffect(() => {
    if (filteredData.length > currentBatch * batchSize) {
      setInfiniteDisabled(false);
    }
  }, [filteredData]);

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
