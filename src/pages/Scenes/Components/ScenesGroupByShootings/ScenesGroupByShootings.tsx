import React, { useEffect } from 'react';
import { IonContent, IonGrid } from '@ionic/react';
import { PermisionTypes } from '../../../../Shared/Components/ProtectedRoute/ProtectedRoute';
import { Section } from '../../../../Shared/Components/Section/Section';
import NoScenesMessage from '../NoScenesMessage/NoScenesMessage';
import { CombinedScenesWithShootings } from '../../../../hooks/useCombinedScenesWithShootings/useCombinedScenesWithShootings';
import ScenesTotals from '../ScenesTotals/ScenesTotals';
import SceneCard from '../SceneCard/SceneCard';

interface ShootingData {
  shootingLabel: string;
  scenes: any[];
}

interface WeekData {
  weekLabel: string;
  shootings: ShootingData[];
}

interface OrganizedData {
  [weekId: string]: WeekData;
}

interface ScenesGroupByShootingsProps {
  scenes: any[];
  weeks: any[]; // Tipo adecuado para las semanas
  searchText: string;
  permissionType: PermisionTypes | null;
  selectedFilterOptions: any;
  setSelectedFilterOptions: (options: any) => void;
}

const ScenesGroupByShootings: React.FC<ScenesGroupByShootingsProps> = ({
  scenes,
  weeks,
  searchText,
  permissionType,
  selectedFilterOptions,
  setSelectedFilterOptions
}) => {
  // Organizar escenas por semana y shooting
  const organizeScenesByWeekAndShooting = () => {
    const result: OrganizedData = {};

    // Inicializar estructura con las semanas
    weeks.forEach(week => {
      const weekId = `${week.weekStart} to ${week.weekEnd}`;
      result[weekId] = {
        weekLabel: `Week ${week.weekStart} to ${week.weekEnd}`,
        shootings: []
      };
    });

    // Función para encontrar la semana a la que pertenece una fecha
    const findWeekForDate = (dateStr: string): string | null => {
      if (!dateStr) return null;

      const shootDate = new Date(dateStr);

      for (const week of weeks) {
        const weekStart = new Date(week.weekStart);
        const weekEnd = new Date(week.weekEnd);

        if (shootDate >= weekStart && shootDate <= weekEnd) {
          return `${week.weekStart} to ${week.weekEnd}`;
        }
      }

      return null;
    };

    // Función para formatear la etiqueta del shooting
    const formatShootingLabel = (shootDate: string, shootingInfo: any): string => {
      const date = new Date(shootDate);
      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });

      return `Shooting ${formattedDate}${shootingInfo.unitId ? ` - Unit: ${shootingInfo.unitId}` : ''}`;
    };

    // Mapa temporal para agrupar escenas por shooting dentro de semanas
    const tempMap: { [weekId: string]: { [shootingLabel: string]: CombinedScenesWithShootings[] } } = {};

    // Agrupar escenas por semana y shooting
    scenes.forEach(scene => {
      if (!scene.shootingInfo || !scene.shootingInfo.shootDate) return;

      const shootDate = scene.shootingInfo.shootDate;
      const weekId = findWeekForDate(shootDate);

      if (!weekId || !result[weekId]) return;

      const shootingLabel = formatShootingLabel(shootDate, scene.shootingInfo);

      // Inicializar estructuras temporales si no existen
      if (!tempMap[weekId]) {
        tempMap[weekId] = {};
      }

      if (!tempMap[weekId][shootingLabel]) {
        tempMap[weekId][shootingLabel] = [];
      }

      // Agregar escena al grupo de shooting
      tempMap[weekId][shootingLabel].push(scene);
    });

    // Convertir el mapa temporal a la estructura final
    Object.keys(tempMap).forEach(weekId => {
      Object.keys(tempMap[weekId]).forEach(shootingLabel => {
        result[weekId].shootings.push({
          shootingLabel,
          scenes: tempMap[weekId][shootingLabel]
        });
      });

      // Ordenar los shootings por fecha (opcional)
      result[weekId].shootings.sort((a, b) => a.shootingLabel.localeCompare(b.shootingLabel));
    });

    return result;
  };

  const organizedData = organizeScenesByWeekAndShooting();

  useEffect(() => {
    console.log('Weeks:', weeks);
    console.log('Organized Data:', organizedData);
  }, [weeks]);

  // Si no hay escenas o no hay datos organizados, mostrar mensaje vacío
  const hasScenes = Object.values(organizedData).some(week => week.shootings.length > 0);

  if (!hasScenes) {
    return (
      <NoScenesMessage
        hasFilters={Object.keys(selectedFilterOptions).length > 0}
        resetFilters={() => setSelectedFilterOptions({})}
      />
    );
  }

  return (
    <IonContent>
      {Object.entries(organizedData).map(([weekId, weekData]) => {
        // Skip empty weeks
        if (weekData.shootings.length === 0) return null;

        // Calcular el total de escenas en esta semana para el resumen
        const scenesInWeek = weekData.shootings.flatMap(shooting => shooting.scenes);

        return (
          <Section
            key={weekId}
            title={weekData.weekLabel}
            open={true}
            color='light'
          >

            {weekData.shootings.map(({ shootingLabel, scenes }) => (
              <Section
                key={`${weekId}-${shootingLabel}`}
                title={shootingLabel}
                open={true}
              >
                {/* Renderizar directamente las escenas en lugar de usar GroupedScenesList */}
                <IonGrid className="scenes-grid ion-margin">
                  {scenes.map((scene, i) => (
                    <SceneCard
                      key={`scene-item-${scene.id || i}-${i}`}
                      scene={scene as any}
                      searchText={searchText}
                      permissionType={permissionType}
                    />
                  ))}
                </IonGrid>
              </Section>
            ))}
            <ScenesTotals scenes={scenesInWeek} isSection />
          </Section>
        );
      })}
    </IonContent>
  );
};

export default ScenesGroupByShootings;