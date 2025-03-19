import { useMemo } from "react";
import { useRxData } from "rxdb-hooks";
import { StripboardDocType, StripboardHasScene } from "../../../Shared/types/stripboard.types";
import { SceneDocType } from "../../../Shared/types/scenes.types";
import { StripboardStatusesEnum } from "../../../Shared/enums/ennums";
import { addDays, format } from "date-fns";
import { UnitDocType } from "../../../Shared/types/unitTypes.types";
import floatToFraction from "../../../Shared/Utils/floatToFraction";
import secondsToMinSec from "../../../Shared/Utils/secondsToMinSec";

interface UseStripboardsProps {
  projectId: string;
}

export type CombinedStripboardType = StripboardDocType & {
  scenes: SceneDocType[];
  totalWeeks: number;
  totalScenes: number;
  totalDays: number;
  totalShootingDays: number;
  statusString: string;
  scenesNotIncluded: SceneDocType[];
  weeks: StripboardWeeks[];
};

export interface StripboardUnits {
  unitId: number,
  unitNumber: string,
  totalScenes: number;
  totalProtection: number;
  totalMinutes: string;
  totalPages: string;
  scenes: SceneDocType[]
}

export interface StripboardWeekDays {
  dayNumber: number;
  totalScenes: number;
  totalProtection: number;
  totalMinutes: string;
  totalPages: string;
  units: StripboardUnits[];
}

export interface StripboardWeeks {
  weekNumber: number;
  weekStartDate: string;
  weekEndDate: string;
  totalScenes: number;
  totalProtection: number;
  totalMinutes: string;
  totalPages: string;
  totalUnits: number;
  totalDays: number;
  days: StripboardWeekDays[];
};

// Función para calcular las métricas para un conjunto de escenas
const calculateMetrics = (scenes: SceneDocType[]) => {
  const totalScenes = scenes.length;
  const totalProtection = scenes.filter(scene => scene.protectionType !== null).length;
  
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

const getNumberOfWeeks = (startDate: string, stripboardHasScenes: StripboardHasScene) => {
  const maxDayNumber = stripboardHasScenes.reduce((acc: number, scene: any) => {
    return scene.dayNumber > acc ? scene.dayNumber : acc;
  }, 0)

  const start = new Date(startDate);
  // sum the max day number to the start date
  start.setDate(start.getDate() + maxDayNumber);
  // get the number of weeks
  return Math.ceil(maxDayNumber / 7);
}

const getNumberOfDays = (stripboardHasScenes: StripboardHasScene) => {
  const uniqueDays = stripboardHasScenes.reduce((acc: number[], scene: any) => {
    if (!acc.includes(scene.dayNumber)) {
      return [...acc, scene.dayNumber];
    }
    return acc;
  }, []);

  return uniqueDays.length;
}

const getTotalShootingDays = (stripboardHasScenes: StripboardHasScene) => {
  const uniqueUnitsDayNumberCombination = stripboardHasScenes.reduce((acc: string[], scene: any) => {
    const key = `${scene.projUnitId}-${scene.dayNumber}`;
    if (!acc.includes(key)) {
      return [...acc, key];
    }
    return acc;
  }, []);

  return uniqueUnitsDayNumberCombination.length;
}

const getScenesInUnit = (unitId: number, stripboardHasScenes: StripboardHasScene, scenes: SceneDocType[], dayNumber?: number): SceneDocType[]  => {
  // Filtrar las entradas de stripboardHasScenes que coincidan con unitId y dayNumber
  const sceneIds = stripboardHasScenes
    .filter(scene => scene.projUnitId === unitId && (dayNumber === undefined || scene.dayNumber === dayNumber))
    .map(scene => scene.sceneId);
  
  // Obtener las escenas completas basadas en los IDs filtrados
  return scenes.filter(scene => sceneIds.includes(scene.sceneId));
}

const getStripboardUnitsInDay = (dayNumber: number, stripboardHasScenes: StripboardHasScene, scenes: SceneDocType[], units: UnitDocType[]): StripboardUnits[] => {
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
}

const getStripboardDaysInWeek = (weekNumber: number, stripboardHasScenes: StripboardHasScene, startDate: string, scenes: SceneDocType[], units: UnitDocType[]): StripboardWeekDays[] => {
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
}

const getStripboardWeeks = (stripboardHasScenes: StripboardHasScene, stripboardStartDate: string, scenes: SceneDocType[], units: UnitDocType[]): StripboardWeeks[] => {
  if (!stripboardHasScenes || !stripboardHasScenes.length || !stripboardStartDate) {
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
    const totalDays = days.length;
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
}

const useStripboards = ({ projectId }: UseStripboardsProps) => {
  const { result: stripboards, isFetching: isStripboardsFetching } = useRxData<StripboardDocType>(
    'stripboards', 
    (collection) => collection.find({
      selector: {
        projectId: Number(projectId),
      }
    })
  );

  const { result: units, isFetching: isUnitsFetching } = useRxData<UnitDocType>(
    'units',
    (collection) => collection.find({
      selector: {
        projectId: Number(projectId),
      }
    })
  );

  const scenesIds = useMemo(() => {
    if (!stripboards || isStripboardsFetching) return [];
    
    return stripboards.reduce((acc: string[], stripboard) => {
      const ids = stripboard?._data?.stripboardHasScenes?.map(
        (scene: any) => scene.sceneId
      ) || [];
      return [...acc, ...ids];
    }, []);
  }, [stripboards, isStripboardsFetching]);

  const { result: scenes, isFetching: isScenesFetching } = useRxData<SceneDocType>(
    'scenes',
    (collection) => collection.find({
      selector: {
        sceneId: { $in: scenesIds.length ? scenesIds : ['none'] }
      }
    })
  );

  const { result: scenesNotIncluded, isFetching: isScenesNotIncludedFetching } = useRxData<SceneDocType>('scenes', (collection) => collection.find({
    selector: {
      projectId: Number(projectId),
      sceneId: { $nin: scenesIds.length ? scenesIds : ['none'] }
    }
  }));

  const combinedStripboards = useMemo<CombinedStripboardType[]>(() => {
    if (!stripboards || !scenes || !units || isStripboardsFetching || isScenesFetching || isUnitsFetching) {
      return [];
    }

    return stripboards.map((stripboard) => {
      // Obtener la estructura de semanas
      const weeks = getStripboardWeeks(
        stripboard.stripboardHasScenes || [], 
        stripboard.startDate || '',
        scenes.map(s => s._data),
        units.map(u => u._data)
      );
      
      return {
        ...stripboard._data,
        scenes: scenes.map(s => s._data),
        scenesNotIncluded: scenesNotIncluded.map(s => s._data) || [],
        totalWeeks: getNumberOfWeeks(stripboard.startDate || '', stripboard.stripboardHasScenes || []),
        totalScenes: stripboard?.stripboardHasScenes?.length || 0,
        totalDays: getNumberOfDays(stripboard.stripboardHasScenes || []),
        totalShootingDays: getTotalShootingDays(stripboard.stripboardHasScenes || []),
        statusString: stripboard.statusId === StripboardStatusesEnum.New ? 'New' : 'Published',
        weeks: weeks,
      };
    });
  }, [stripboards, scenes, units, isStripboardsFetching, isScenesFetching, isUnitsFetching, scenesNotIncluded, isScenesNotIncludedFetching]);

  return {
    stripboards: combinedStripboards,
    isFetching: isStripboardsFetching || isScenesFetching || isUnitsFetching || isScenesNotIncludedFetching
  };
};

export default useStripboards;