import { IonCard, IonCardContent, IonCardHeader } from '@ionic/react';
import { capitalize } from 'lodash';
import { Note, Scene } from '../../interfaces/scenesTypes';

const CategoryContainer = ({
  categoryName, scene, characters, extras, elements, notes,
}: any) => {
  const getCharactersByCategory = (categoryName: string, scene: Scene) => {
    const characters = scene.characters ? scene.characters.filter((character: any) => {
      if (categoryName === 'NO CATEGORY') return character.categoryName === null;
      return character.categoryName === categoryName;
    }) : [];
    return characters;
  };

  const getExtrasByCategory = (categoryName: string, scene: Scene) => {
    const extras = scene.extras ? scene.extras.filter((extra: any) => {
      if (categoryName === 'NO CATEGORY') return extra.categoryName === null;
      return extra.categoryName === categoryName;
    }) : [];
    return extras;
  };

  const getElementsByCategory = (categoryName: string, scene: Scene) => {
    const elements = scene.elements ? scene.elements.filter((element: any) => {
      if (categoryName === 'NO CATEGORY') return element.categoryName === null;
      return element.categoryName === categoryName;
    }) : [];
    return elements;
  };

  const getNotes = (scene: Scene) => {
    const notes = scene.notes ? scene.notes.filter((note: Note) => note.note !== null) : [];
    return notes;
  };

  const getValuesByCategory = (categoryName: string, scene: Scene) => {
    if (characters) {
      return getCharactersByCategory(categoryName, scene);
    } if (extras) {
      return getExtrasByCategory(categoryName, scene);
    } if (elements) {
      return getElementsByCategory(categoryName, scene);
    } if (notes) {
      return getNotes(scene);
    }
    return [];
  };

  if (getValuesByCategory(categoryName, scene).length > 0) {
    return (
      <IonCard
        color="tertiary"
        className="scene-details-card ion-padding-bottom"
        style={notes ? { gridColumn: '1 / span 3' } : {}}
      >
        <IonCardHeader>
          <p>
            {capitalize(categoryName)}
            {' '}
          </p>
        </IonCardHeader>
        <IonCardContent>
          {
            getValuesByCategory(categoryName, scene).map((value: any, i) => (
              <p
                style={{ fontSize: '16px', margin: '6px 0px' }}
                key={i + Math.random()}
              >
                {
                  characters
                  && (value.characterNum ? `${value.characterNum}. ${value.characterName.toUpperCase()}` : value.characterName.toUpperCase())
                }
                {
                  extras
                  && value.extraName
                  && value.extraName.toUpperCase()
                }
                {
                  elements
                  && value.elementName
                  && value.elementName.toUpperCase()
                }
                {
                  notes
                  && value.note
                  && value.note.toUpperCase()
                }
              </p>
            ))
          }
        </IonCardContent>
      </IonCard>
    );
  }
};

export default CategoryContainer;
