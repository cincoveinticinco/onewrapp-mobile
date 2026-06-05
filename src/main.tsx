import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './theme/main.scss';
import { DatabaseContextProvider } from './context/Database/Database.context';
import { AuthProvider } from './context/Auth/Auth.context';
import environment from '../environment';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { databaseManager } from './database';

// Inicializar solo la base de datos local ANTES de React
// La replicación se hará después cuando tengamos getToken en el contexto
databaseManager.initializeDatabase().then(() => {
  console.log('✅ Database initialized before React mount');
}).catch(error => {
  console.error('❌ Failed to initialize database:', error);
});

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