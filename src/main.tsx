import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './theme/main.scss';
import { DatabaseContextProvider } from './context/Database.context';
import { AuthProvider } from './context/Auth.context';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { isPlatform } from '@ionic/react';
import environment from '../environment';

const container = document.getElementById('root');
const root = createRoot(container!);

const clientId = isPlatform('capacitor') 
  ? environment.CLIENT_ID_ANDROID 
  : environment.CLIENT_ID;

root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <AuthProvider>
      <DatabaseContextProvider>
        <App />
      </DatabaseContextProvider>
    </AuthProvider>
  </GoogleOAuthProvider>,
);
