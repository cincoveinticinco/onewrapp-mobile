import { EnvironmentPlugin } from './plugins/EnvironmentPlugin';

interface Environment {
  URL_PATH: string;
  SCENES_ENDPOINT_PULL: string;
  SCENE_PARAGRAPHS_ENDPOINT_PULL: string;
  SCENES_ENDPOINT_PUSH: string;
  SCENE_PARAGRAPHS_ENDPOINT_PUSH: string;
  CLIENT_ID: string;
  CLIENT_ID_ANDROID: string;
  PROJECTS_ENDPOINT_PULL: string;
  SHOOTINGS_ENDPOINT_PULL: string;
  SHOOTINGS_ENDPOINT_PUSH: string;
  UNITS_ENDPOINT_PULL: string;
  UNITS_ENDPOINT_PUSH: string;
  TALENTS_ENDPOINT_PULL: string;
  TALENTS_ENDPOINT_PUSH: string;
  MAPS_KEY: string;
  CREW_ENDPOINT_PULL: string;
  CREW_ENDPOINT_PUSH: string;
  COUNTRIES_ENDPOINT_PULL: string;
  SERVICE_MATRICES_ENDPOINT_PULL: string;
  SERVICE_MATRICES_ENDPOINT_PUSH: string;
  USER_ENDPOINT_PULL: string;
}

const environmentVariables: Environment = {
  URL_PATH: import.meta.env.VITE_URL_PATH_LOCAL || '',
  SCENES_ENDPOINT_PULL: import.meta.env.VITE_SCENES_ENDPOINT_PULL || '',
  SCENE_PARAGRAPHS_ENDPOINT_PULL: import.meta.env.VITE_SCENE_PARAGRAPHS_ENDPOINT_PULL || '',
  SCENES_ENDPOINT_PUSH: import.meta.env.VITE_SCENES_ENDPOINT_PUSH || '',
  SCENE_PARAGRAPHS_ENDPOINT_PUSH: import.meta.env.VITE_SCENE_PARAGRAPHS_ENDPOINT_PUSH || '',
  CLIENT_ID: import.meta.env.VITE_CLIENT_ID || '',
  CLIENT_ID_ANDROID: import.meta.env.VITE_CLIENT_ID_ANDROID || '',
  PROJECTS_ENDPOINT_PULL: import.meta.env.VITE_PROJECTS_ENDPOINT_PULL || '',
  SHOOTINGS_ENDPOINT_PULL: import.meta.env.VITE_SHOOTINGS_ENDPOINT_PULL || '',
  SHOOTINGS_ENDPOINT_PUSH: import.meta.env.VITE_SHOOTINGS_ENDPOINT_PUSH || '',
  UNITS_ENDPOINT_PULL: import.meta.env.VITE_UNITS_ENDPOINT_PULL || '',
  UNITS_ENDPOINT_PUSH: import.meta.env.VITE_UNITS_ENDPOINT_PUSH || '',
  TALENTS_ENDPOINT_PULL: import.meta.env.VITE_TALENTS_ENDPOINT_PULL || '',
  TALENTS_ENDPOINT_PUSH: import.meta.env.VITE_TALENTS_ENDPOINT_PUSH || '',
  MAPS_KEY: import.meta.env.VITE_MAPS_KEY || '',
  CREW_ENDPOINT_PULL: import.meta.env.VITE_CREW_ENDPOINT_PULL || '',
  CREW_ENDPOINT_PUSH: import.meta.env.VITE_CREW_ENDPOINT_PUSH || '',
  COUNTRIES_ENDPOINT_PULL: import.meta.env.VITE_COUNTRIES_ENDPOINT_PULL || '',
  SERVICE_MATRICES_ENDPOINT_PULL: import.meta.env.VITE_SERVICE_MATRICES_ENDPOINT_PULL || '',
  SERVICE_MATRICES_ENDPOINT_PUSH: import.meta.env.VITE_SERVICE_MATRICES_ENDPOINT_PUSH || '',
  USER_ENDPOINT_PULL: import.meta.env.VITE_USER_ENDPOINT_PULL || '',
};

const envConfigs: Record<string, Environment> = {
  qa: {
    ...environmentVariables,
    URL_PATH: import.meta.env.VITE_URL_PATH_STAGING || '',
  },
  production: {
    ...environmentVariables,
    URL_PATH: import.meta.env.VITE_URL_PATH_PRODUCTION || '',
  },
  local: {
    ...environmentVariables,
    URL_PATH: import.meta.env.VITE_URL_PATH_LOCAL || '',
  }
};

// Exportamos el environment por defecto para mantener compatibilidad
const environment: Environment = envConfigs.qa;

export async function loadEnvironment(isIos: boolean) {
  if(isIos) {
    try {
      const { environment: selectedEnv } = await EnvironmentPlugin.getEnvironment();
      console.log("Ambiente seleccionado:", selectedEnv);
      // Actualizamos el environment objeto directamente
      Object.assign(environment, envConfigs[selectedEnv] || envConfigs.qa);
    } catch (error) {
      console.error("Error al obtener el ambiente:", error);
      // En caso de error, nos aseguramos de usar producción
      Object.assign(environment, envConfigs.qa);
    }
  } else {
    Object.assign(environment, envConfigs.local);
  }
}

// Exportación por defecto del environment
export default environment;