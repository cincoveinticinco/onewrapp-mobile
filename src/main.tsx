import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/* Overwrite main.css */

import './theme/main.scss';
import { DatabaseContextProvider } from './context/Database.context';
import { AuthProvider } from './context/Auth.context';
import { GoogleOAuthProvider } from '@react-oauth/google';
import environment from '../environment';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <GoogleOAuthProvider clientId={environment.CLIENT_ID}>
    <AuthProvider>
      <DatabaseContextProvider>
        <App />
      </DatabaseContextProvider>
      ,
    </AuthProvider>
  </GoogleOAuthProvider>,
);
