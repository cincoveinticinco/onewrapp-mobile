import {
  IonButton, IonCheckbox, IonIcon, IonItem,
} from '@ionic/react';
import { appsSharp } from 'ionicons/icons';
import React from 'react';
import './SortItem.scss';

interface SortItemProps {
  sortOption: any;
}

const SortItem: React.FC<SortItemProps> = ({ sortOption }) => (
  <IonItem color="tertiary" className="sort-option-item">
    <IonButton fill="clear" color="light" slot="start" className="sort-page-icons">
      <IonIcon className="ion-no-padding ion-no-margin" icon={appsSharp} />
    </IonButton>
    <IonCheckbox
      className="checkbox-item-option"
      slot="start"
      labelPlacement="end"
    >
      {sortOption.label}
    </IonCheckbox>
    <IonButton fill="clear" color="light" slot="end">
      DESC
    </IonButton>
    <IonButton fill="clear" color="light" slot="end">
      ASC
    </IonButton>
  </IonItem>
);

export default SortItem;
