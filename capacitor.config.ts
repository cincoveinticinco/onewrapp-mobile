import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.onewrapp.mobile',
  appName: 'one-wrapp-mobile',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
