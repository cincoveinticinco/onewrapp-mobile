import { registerPlugin } from '@capacitor/core';

export interface EnvironmentPlugin {
  getEnvironment(): Promise<{ environment: string }>;
}

export const EnvironmentPlugin = registerPlugin<EnvironmentPlugin>('EnvironmentPlugin');
