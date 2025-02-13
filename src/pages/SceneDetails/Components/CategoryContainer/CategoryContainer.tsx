import { IonCardContent, IonCardHeader } from '@ionic/react';
import { Note, SceneDocType } from '../../../../Shared/types/scenes.types';
import { EmptyEnum } from '../../../../Shared/ennums/ennums';

const CategoryContainer = ({
  categoryName, scene, characters, extras, elements, notes,
}: any) => {
  const getCharactersByCategory = (categoryName: string, scene: SceneDocType) => {
    const characters = scene.characters ? scene.characters.filter((character: any) => {
      if (categoryName === EmptyEnum.NoCategory) return character.categoryName === null;
      return character.categoryName === categoryName;
    }) : [];
    return characters;
  };

  const getExtrasByCategory = (categoryName: string, scene: SceneDocType) => {
    const extras = scene.extras ? scene.extras.filter((extra: any) => {
      if (categoryName === EmptyEnum.NoCategory) return extra.categoryName === null;
      return extra.categoryName === categoryName;
    }) : [];
    return extras;
  };

  const getElementsByCategory = (categoryName: string, scene: SceneDocType) => {
    const elements = scene.elements ? scene.elements.filter((element: any) => {
      if (categoryName === EmptyEnum.NoCategory) return element.categoryName === null;
      return element.categoryName === categoryName;
    }) : [];
    return elements;
  };

  const getNotes = (scene: SceneDocType) => {
    const notes = scene.notes ? scene.notes.filter((note: Note) => note.note !== null) : [];
    return notes;
  };

  const getValuesByCategory = (categoryName: string, scene: SceneDocType) => {
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
      <>
        <IonCardHeader>
          <p>
            <b>
              {categoryName.toUpperCase()}
              {' '}
              {' '}
            </b>
          </p>
        </IonCardHeader>
        <IonCardContent>
          {
            getValuesByCategory(categoryName, scene).map((value: any, i) => (
              <p
                style={{ fontSize: '14px', margin: '6px 0px' }}
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
      </>
    );
  }
};

export default CategoryContainer;
