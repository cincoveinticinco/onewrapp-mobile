import React from 'react';
import { IonButton } from '@ionic/react';

interface NoScenesMessageProps {
  hasFilters: boolean;
  resetFilters: () => void;
}

const NoScenesMessage: React.FC<NoScenesMessageProps> = ({ 
  hasFilters, 
  resetFilters 
}) => {
  if (hasFilters) {
    return (
      <div className="no-items-message">
        <p className="ion-no-margin">There are not any scenes that match your search.</p>
        <IonButton
          fill="clear"
          color="primary"
          className="ion-no-margin reset-filters-option"
          onClick={resetFilters}
        >
          Reset Filters
        </IonButton>
      </div>
    );
  }

  return (
    <div className="no-items-message">
      <p className="ion-no-margin">There are not any scenes in this project.</p>
    </div>
  );
};

export default NoScenesMessage;