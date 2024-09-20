import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.onewrapp.offline',
  appName: 'one-wrapp-mobile',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    GoogleMaps: {
      AndroidApiKey: "AIzaSyA9rz3ykn0BboO4tjO2_fSKE82_CiIZmJI"
    }
  }
};

export default config;