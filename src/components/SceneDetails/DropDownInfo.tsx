import { useState } from 'react';
import { IonCard, IonCardHeader, IonCardSubtitle } from '@ionic/react';
import sortArrayAlphabeticaly from '../../utils/sortArrayAlphabeticaly';
import DropDownButton from '../Shared/DropDownButton/DropDownButton';
import CategoryContainer from './CategoryContainer';
import { text } from 'ionicons/icons';

const DropDownInfo = ({
  categories, scene, title, characters = false, extras = false, elements = false, notes = false,
}: any) => {
  const [open, setOpen] = useState<boolean>(true);
  const valuesByCategory = characters ? scene.characters.length === 0 : extras ? scene.extras.length === 0 : elements ? scene.elements.length === 0 : notes ? scene.notes.every((note: any) => note.note === null) : true;

  const getUniqueCategoriesFromScene = (scene: any, characters: boolean, extras: boolean, elements: boolean) => {
    const categories = characters ? scene.characters.map((character: any) => character.categoryName) : extras ? scene.extras.map((extra: any) => extra.categoryName) : elements ? scene.elements.map((element: any) => element.categoryName) : [];
    return sortArrayAlphabeticaly([...new Set(categories)]);
  };

  return (
    <>
      <div className="ion-flex ion-justify-content-between ion-padding-start" style={{ backgroundColor: 'var(--ion-color-dark)' }}>
        <p style={{ fontSize: '18px' }}><b>{title}</b></p>
      </div>
      {
        open && (
          <div className="categories-card-container">
            <IonCard
              color="tertiary"
              className="scene-details-card ion-flex-column ion-justify-content-start align-items-center"
            >
              { scene
                && categories.map((category: string) => <CategoryContainer categoryName={category || 'NO CATEGORY'} scene={scene} key={`${category}details`} characters={characters} extras={extras} elements={elements} notes={notes} />)}
              {
              valuesByCategory
              && (
                <IonCardHeader
                  className='ion-padding'
                  style={{
                    height: '100%'
                  }}
                >
                  <IonCardSubtitle className="no-items-card-title ion-flex ion-justify-content-center ion-align-items-center ion-padding" style={{
                    height: '100%', textAlign: 'center'
                  }}>
                    {
                      characters
                      && 'NO CHARACTERS ADDED TO THIS SCENE'
                    }
                    {
                      extras
                      && 'NO EXTRAS ADDED TO THIS SCENE'
                    }
                    {
                      elements
                      && 'NO ELEMENTS ADDED TO THIS SCENE'
                    }
                    {
                      notes
                      && 'NO NOTES ADDED TO THIS SCENE'
                    }
                  </IonCardSubtitle>
                </IonCardHeader>
              )
            }
            </IonCard>
          </div>
        )
      }
    </>
  );
};

export default DropDownInfo;
