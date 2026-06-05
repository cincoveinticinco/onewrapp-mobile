import { StripboardHasScene, StripboardUnits, StripboardWeekDays, StripboardWeeks } from "../../Shared/types/stripboard.types";
import { SceneDocType } from "../../Shared/types/scenes.types";
import { UnitDocType } from "../../Shared/types/unitTypes.types";
import { addDays, format } from "date-fns";
import floatToFraction from "./floatToFraction";
import secondsToMinSec from "./secondsToMinSec";

// Función para calcular las métricas para un conjunto de escenas
export const calculateMetrics = (scenes: SceneDocType[]) => {
  const totalScenes = scenes?.length;
  const totalProtection = scenes.filter(scene => scene.protectionType !== null)?.length;
  
  // Calcular minutos totales
  const totalSeconds = scenes.reduce((acc, scene) => acc + (scene.estimatedSeconds || 0), 0);
  const totalMinutes = secondsToMinSec(totalSeconds);
  
  // Calcular páginas totales
  const totalPagesFloat = scenes.reduce((acc, scene) => acc + (scene.pages || 0), 0);
  const totalPages = floatToFraction(totalPagesFloat);
  
  return {
    totalScenes,
    totalProtection,
    totalMinutes,
    totalPages
  };
};

export const getNumberOfWeeks = (startDate: string, stripboardHasScenes: StripboardHasScene) => {
  const maxDayNumber = stripboardHasScenes.reduce((acc: number, scene: any) => {
    return scene.dayNumber > acc ? scene.dayNumber : acc;
  }, 0);

  if (maxDayNumber === 0 || !startDate) return 0;

  // get the number of weeks
  return Math.ceil(maxDayNumber / 7);
};

export const getNumberOfDays = (stripboardHasScenes: StripboardHasScene) => {
  const uniqueDays = stripboardHasScenes.reduce((acc: number[], scene: any) => {
    if (!acc.includes(scene.dayNumber)) {
      return [...acc, scene.dayNumber];
    }
    return acc;
  }, []);

  return uniqueDays?.length;
};

export const getTotalShootingDays = (stripboardHasScenes: StripboardHasScene) => {
  const uniqueUnitsDayNumberCombination = stripboardHasScenes.reduce((acc: string[], scene: any) => {
    const key = `${scene.projUnitId}-${scene.dayNumber}`;
    if (!acc.includes(key)) {
      return [...acc, key];
    }
    return acc;
  }, []);

  return uniqueUnitsDayNumberCombination?.length;
};

export const getScenesInUnit = (unitId: number, stripboardHasScenes: StripboardHasScene, scenes: SceneDocType[], dayNumber?: number): SceneDocType[]  => {
  // Filtrar las entradas de stripboardHasScenes que coincidan con unitId y dayNumber

  const deepCopy: StripboardHasScene = JSON.parse(JSON.stringify(stripboardHasScenes));

  const sceneIds = deepCopy
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .filter(scene => scene.projUnitId === unitId && (dayNumber === undefined || scene.dayNumber === dayNumber))
    .map(scene => scene.sceneId)

  const orderedScenes: SceneDocType[] = [];

  sceneIds.forEach(sceneId => {
    const scene = scenes.find(s => s.sceneId === sceneId);
    if(scene) {
      orderedScenes.push(scene);
    }
  });
  
  return orderedScenes
};

export const getStripboardUnitsInDay = (dayNumber: number, stripboardHasScenes: StripboardHasScene, scenes: SceneDocType[], units: UnitDocType[]): StripboardUnits[] => {
  // Encontrar todas las unidades únicas para el día especificado
  const uniqueUnitIds = [...new Set(
    stripboardHasScenes
      .filter(scene => scene.dayNumber === dayNumber)
      .map(scene => scene.projUnitId)
  )];
  
  // Mapear los IDs de unidades a objetos StripboardUnits
  return uniqueUnitIds.map(unitId => {
    const unit = units.find(u => Number(u.id) === unitId);
    const unitScenes = getScenesInUnit(unitId ?? 0, stripboardHasScenes, scenes, dayNumber);
    const metrics = calculateMetrics(unitScenes);
    
    return {
      unitId: unitId ?? 0,
      unitNumber: unit?.unitNumber ? `${unit.unitNumber}` : '',
      scenes: unitScenes,
      ...metrics
    };
  });
};

export const getStripboardDaysInWeek = (weekNumber: number, stripboardHasScenes: StripboardHasScene, startDate: string, scenes: SceneDocType[], units: UnitDocType[]): StripboardWeekDays[] => {
  const weekStartDay = (weekNumber - 1) * 7 + 1; 
  const weekEndDay = weekNumber * 7;
  const uniqueDayNumbers = [...new Set(
    stripboardHasScenes
      .filter(scene => scene.dayNumber !== undefined && scene.dayNumber >= weekStartDay && scene.dayNumber <= weekEndDay)
      .map(scene => scene.dayNumber)
  )].sort((a, b) => (a ?? 0) - (b ?? 0));
  
  // Mapear los números de día a objetos StripboardWeekDays
  return uniqueDayNumbers.map(dayNumber => {
    if(dayNumber) {
      const dayUnits = getStripboardUnitsInDay(dayNumber, stripboardHasScenes, scenes, units);
      
      // Calcular métricas para todas las escenas del día
      const dayScenes = dayUnits.flatMap(unit => unit.scenes);
      const metrics = calculateMetrics(dayScenes);
      
      return {
        dayNumber,
        units: dayUnits,
        ...metrics
      };
    }
    return undefined;
  }).filter((day): day is StripboardWeekDays => day !== undefined);
};

export const getStripboardWeeks = (stripboardHasScenes: StripboardHasScene, stripboardStartDate: string, scenes: SceneDocType[], units: UnitDocType[]): StripboardWeeks[] => {
  if (!stripboardHasScenes || !stripboardHasScenes?.length || !stripboardStartDate) {
    return [];
  }

  const totalWeeks = getNumberOfWeeks(stripboardStartDate, stripboardHasScenes);
  const startDateObj = new Date(stripboardStartDate);
  
  // Crear un array con la información de cada semana
  const weeks: StripboardWeeks[] = [];
  
  for (let weekNumber = 1; weekNumber <= totalWeeks; weekNumber++) {
    const weekStartDate = addDays(startDateObj, (weekNumber - 1) * 7);
    const weekEndDate = addDays(weekStartDate, 6);
    
    // Obtener los días para esta semana
    const days = getStripboardDaysInWeek(weekNumber, stripboardHasScenes, stripboardStartDate, scenes, units);
    
    // Calcular métricas para toda la semana
    const weekScenes = days.flatMap(day => day.units.flatMap(unit => unit.scenes));
    const metrics = calculateMetrics(weekScenes);
    
    // Calcular totalDays y totalUnits
    const totalDays = days?.length;
    const totalUnits = new Set(days.flatMap(day => day.units.map(unit => unit.unitId))).size;
    
    weeks.push({
      weekNumber,
      weekStartDate: format(weekStartDate, 'yyyy-MM-dd'),
      weekEndDate: format(weekEndDate, 'yyyy-MM-dd'),
      days,
      totalDays,
      totalUnits,
      ...metrics
    });
  }
  
  return weeks;
};