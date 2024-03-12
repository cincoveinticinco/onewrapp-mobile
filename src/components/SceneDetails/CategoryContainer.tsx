import { IonCard, IonCardContent, IonCardHeader } from "@ionic/react"
import { Scene } from "../../interfaces/scenesTypes"
import { capitalize } from "lodash"

const CategoryContainer = ({ categoryName, scene, characters, extras, elements}: any) => {
  const getCharactersByCategory = (categoryName: string, scene: Scene) => {
    const characters = scene.characters ? scene.characters.filter((character: any) => {
      if(categoryName ==='NO CATEGORY') return character.categoryName === null
      return character.categoryName === categoryName
    }) : []
    return characters
  }

  const getExtrasByCategory = (categoryName: string, scene: Scene) => {
    const extras = scene.extras ? scene.extras.filter((extra: any) => {
      if(categoryName ==='NO CATEGORY') return extra.categoryName === null
      return extra.categoryName === categoryName
    }) : []
    return extras
  }

  const getElementsByCategory = (categoryName: string, scene: Scene) => {
    const elements = scene.elements ? scene.elements.filter((element: any) => {
      if(categoryName ==='NO CATEGORY') return element.categoryName === null
      return element.categoryName === categoryName
    }) : []
    return elements
  }

  const getValuesByCategory = (categoryName: string, scene: Scene) => {
    if(characters) {
      return getCharactersByCategory(categoryName, scene)
    } else if(extras) {
      return getExtrasByCategory(categoryName, scene)
    } else if(elements) {
      return getElementsByCategory(categoryName, scene)
    }
    return []
  }

  if(getCharactersByCategory(categoryName, scene).length > 0 || getExtrasByCategory(categoryName, scene).length > 0 || getElementsByCategory(categoryName, scene).length > 0) {
    return (
      <IonCard
        color='tertiary'
        className='scene-details-card'
      >
        <IonCardHeader>
          <p  >{capitalize(categoryName)} </p >
        </IonCardHeader>
        <IonCardContent>
          {
            getValuesByCategory(categoryName, scene).map((value: any, i) => {
              return <p 
                style={{fontSize: '16px', margin: '6px 0px'}}
                key={ i + Math.random()}
              >
                {
                  characters &&
                  (value.characterNum ? value.characterNum + '. ' + value.characterName.toUpperCase() : value.characterName.toUpperCase())
                }
                {
                  extras &&
                  value.extraName && 
                  value.extraName.toUpperCase()
                }
                {
                  elements &&
                  value.elementName && 
                  value.elementName.toUpperCase()
                }
              </p>
            })
          }
        </IonCardContent>
      </IonCard>
    )
  }
}

export default CategoryContainer;