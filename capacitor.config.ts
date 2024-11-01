import { CapacitorConfig } from '@capacitor/cli';
import environment from './environment';

const config: CapacitorConfig = {
  appId: 'com.onewrapp.mobile',
  appName: 'one-wrapp-mobile',
  webDir: 'dist',
  bundledWebRuntime: false,
  // server: {
  //   url: 'http://192.168.1.23:8100',
  //   cleartext: true
  // },
  plugins: {
    GoogleMaps: {
      AndroidApiKey: "AIzaSyA9rz3ykn0BboO4tjO2_fSKE82_CiIZmJI"
    },
    GoogleAuth: {
      "scopes": [
        "profile",
        "email"
      ],
      "serverClientId": "195018623531-mm7krht1hr7tj3501el59mug4rj62u5u.apps.googleusercontent.com",
      clientId: "195018623531-mm7krht1hr7tj3501el59mug4rj62u5u.apps.googleusercontent.com",
      iosClientId: "195018623531-s2ik3l0j2lmktn4caqebhc0ebs67ftq3.apps.googleusercontent.com"
    }
  },

};

export default config;