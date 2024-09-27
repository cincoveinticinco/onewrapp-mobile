import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './theme/main.scss';
import { DatabaseContextProvider } from './context/Database.context';
import { AuthProvider } from './context/Auth.context';
import { isPlatform } from '@ionic/react';
import environment from '../environment';
import { GoogleOAuthProvider } from '@react-oauth/google';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <GoogleOAuthProvider clientId={environment.CLIENT_ID}>
    <AuthProvider>
      <DatabaseContextProvider>
        <App />
      </DatabaseContextProvider>
    </AuthProvider>
  </GoogleOAuthProvider>,
);