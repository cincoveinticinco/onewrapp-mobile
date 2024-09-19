import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.onewrapp.offline',
  appName: 'one-wrapp-mobile',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
