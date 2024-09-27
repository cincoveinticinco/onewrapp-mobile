import { CapacitorConfig } from '@capacitor/cli';
import environment from './environment';

const config: CapacitorConfig = {
  appId: 'com.onewrapp.offline',
  appName: 'one-wrapp-mobile',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    GoogleAuth: {
      "scopes": [
        "profile",
        "email"
      ],
      "serverClientId": "195018623531-mm7krht1hr7tj3501el59mug4rj62u5u.apps.googleusercontent.com",
      clientId: "195018623531-mm7krht1hr7tj3501el59mug4rj62u5u.apps.googleusercontent.com"
    }
  }
};

export default config;