import React, { useContext, useState, useCallback, useEffect } from 'react';
import environment from '../../environment';
import { set } from 'lodash';

interface AuthContextType {
  loggedIn: boolean;
  user: any | null;
  checkSession: () => Promise<boolean>;
  saveLogin: (token: string, userData: any) => void;
  logout: () => void;
  loading: boolean;
  getToken: () => Promise<string>;
}

export const AuthContext = React.createContext<AuthContextType>({
  loggedIn: false,
  user: null,
  checkSession: async () => false,
  saveLogin: () => {},
  logout: () => {},
  loading: true,
  getToken: () => new Promise(() => {}),
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string>('');

  const checkSession = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`${environment.URL_PATH}/verify_session`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setLoggedIn(true);
          return true;
        } else {
          localStorage.removeItem('token');
          setUser(null);
          setLoggedIn(false);
          return false;
        }
      } catch (error) {
        console.error('Error verifying session:', error);
        localStorage.removeItem('token');
        setUser(null);
        setLoggedIn(false);
        return false;
      }
    }
    setLoggedIn(false);
    return false;
  }, []);

  useEffect(() => {
    checkSession().finally(() => setLoading(false));
  }, [checkSession]);

  const saveLogin = useCallback((token: string, userData: any) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(userData);
    setLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setLoggedIn(false);
  }, []);

  const getToken = useCallback(() => {
    return new Promise<string>((resolve) => {
      const checkToken = () => {
        const token = localStorage.getItem('token');
        if (token) {
          resolve(token);
        } else {
          setTimeout(checkToken, 100);
        }
      };
      checkToken();
    });
  }, []);

  const value = {
    loggedIn,
    user,
    checkSession,
    saveLogin,
    logout,
    loading,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;