import React from 'react';
import {
  IonButton, IonContent, IonHeader, IonIcon,
  IonList, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import { useHistory } from 'react-router';
import { chevronBack } from 'ionicons/icons';
import useIsMobile from '../../hooks/useIsMobile';
import './SortScenes.scss';
import SortItem from '../../components/SortScenes/SortItem';
import useHideTabs from '../../hooks/useHideTabs';

const SortScenes = () => {
  const sortOptions = [
    {
      label: 'EP NUMBER',
    },
    {
      label: 'SCENE NUMBER',
    },
    {
      label: 'DAY OR NIGHT',
    },
    {
      label: 'INT OR EXT',
    },
    {
      label: 'LOCATION NAME',
    },
    {
      label: 'SET NAME',
    },
    {
      label: 'SCRIPT DAY',
    },
    {
      label: 'CHARACTERS',
    },
  ];

  const history = useHistory();
  const isMobile = useIsMobile();

  useHideTabs();

  const handleBack = () => {
    history.goBack();
  };

  return (
    <IonPage color="tertiary">
      <IonHeader>
        <IonToolbar color="tertiary" className="add-strip-toolbar">
          {
          !isMobile
          && (
          <>
            <IonButton fill="clear" color="primary" slot="start" onClick={handleBack}>
              BACK
            </IonButton>
            <IonButton fill="clear" color="primary" slot="end">
              RESET
            </IonButton>
          </>
          )
          }

          {
            isMobile
            && (
            <IonButton fill="clear" color="primary" slot="start" onClick={handleBack}>
              <IonIcon icon={chevronBack} color="light" />
            </IonButton>
            )
          }
          <IonTitle className="add-strip-toolbar-title">
            Sort By
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color="tertiary">
        <IonList color="tertiary" className="ion-no-padding ion-margin-top sort-items-list">
          {
          sortOptions.map((sortOption) => (
            <SortItem key={sortOption.label} sortOption={sortOption} />
          ))
        }
        </IonList>
      </IonContent>
    </IonPage>
  );
};

// sort by scene number, ep number
// convert string to number

export default SortScenes;
