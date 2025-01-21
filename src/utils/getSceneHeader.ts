import { Scene } from "../interfaces/scenes.types";

function getSceneHeader(scene: Scene) {
  const episodeNumber = scene.episodeNumber || '';
  const sceneNumber = scene.sceneNumber || '';
  const intOrExt = scene.intOrExtOption || '';
  const locationName = scene.locationName || '';
  const setName = scene.setName || '';
  const dayOrNight = scene.dayOrNightOption || '';
  const scriptDay = scene.scriptDay || '';
  const year = scene.year || '';

  const sceneHeader = `${episodeNumber}.${sceneNumber} ${intOrExt ? (`${intOrExt}.`) : ''} ${locationName ? (`${locationName}.`) : ''} ${setName}-${dayOrNight}${scriptDay} ${year ? `(${
    year})` : ''}`;


  return sceneHeader.toUpperCase();
}

export default getSceneHeader;