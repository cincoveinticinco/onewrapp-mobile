import React, { useEffect, useState, useCallback } from 'react';
import { IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import { useLocation } from 'react-router';

interface ScrollInfiniteContextV2Props {
  children: React.ReactNode;
  filteredData: any[];
  setDisplayedData: React.Dispatch<React.SetStateAction<number>>;
  batchSize?: number;
}

const BATCH_SIZE = 20;

const ScrollInfiniteContextV2: React.FC<ScrollInfiniteContextV2Props> = ({
  children, 
  filteredData, 
  setDisplayedData,
  batchSize = BATCH_SIZE
}) => {
  const [currentBatch, setCurrentBatch] = useState<any[]>([]);
  const [isInfiniteDisabled, setIsInfiniteDisabled] = useState(false);
  const location = useLocation();

  const loadMoreData = useCallback(() => {
    setDisplayedData(prev => prev + batchSize);
  }, [setDisplayedData, batchSize]);

  const handleInfinite = (e: CustomEvent<void>) => {
    loadMoreData();
    (e.target as HTMLIonInfiniteScrollElement).complete();
  };

  // Reset when filtered data or path changes
  useEffect(() => {
    setCurrentBatch(filteredData.slice(0, batchSize));
    setIsInfiniteDisabled(false);
  }, [filteredData, location.pathname, batchSize]);

  return (
    <div>
      {children}
      
      { (
        <IonInfiniteScroll 
          onIonInfinite={handleInfinite} 
          disabled={isInfiniteDisabled || currentBatch.length >= filteredData.length}
          threshold="100px"
        >
          <IonInfiniteScrollContent loadingText="Loading more..." />
        </IonInfiniteScroll>
      )}
    </div>
  );
};

export default ScrollInfiniteContextV2;