import React, {
  useContext, useState, useCallback,
  useEffect,
} from 'react';
import environment from '../../environment';
import { useHistory } from 'react-router';
import useErrorToast from '../hooks/Shared/useErrorToast';
import DatabaseContext from './Database.context';

interface AuthContextType {
  loggedIn: boolean;
  user: any | null;
  checkSession: () => Promise<boolean>;
  saveLogin: (token: string, userData: any) => void;
  logout: any;
  loading: boolean;
  getToken: () => Promise<string>;
  setLoadingAuth: (loading: boolean) => void;
  setLoggedIn: (loggedIn: boolean) => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  loggedIn: false,
  user: null,
  checkSession: async () => false,
  saveLogin: () => {},
  logout: () => {},
  loading: true,
  getToken: () => new Promise(() => {}),
  setLoadingAuth: () => {},
  setLoggedIn: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState<boolean>(localStorage.getItem('loggedIn') === 'true' || false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string>('');
  const { oneWrapDb } = useContext(DatabaseContext);
  

  const checkSession = useCallback(async () => {
   
    return true;
  }, []);

    // save loggedin in localstorage
  useEffect(() => {
    localStorage.setItem('loggedIn', loggedIn.toString());
  }, [loggedIn]);

  const saveLogin = useCallback((token: string, userData: any) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(userData);
    setLoggedIn(true);
  }, []);

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedIn');
    setUser(null);
    setLoggedIn(false);
    window.location.href = '/';
    console.log('LOGOUT')
    // Remove user fron local data
    const user = await oneWrapDb?.user.findOne().exec();
    if (user) {
     await user.remove()
    }
  }

  const getToken = useCallback(() => new Promise<string>((resolve) => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (token) {
        resolve(token);
      } else {
        setTimeout(checkToken, 100);
      }
    };
    checkToken();
  }), []);


  const value = {
    loggedIn,
    user,
    checkSession,
    saveLogin,
    logout,
    loading,
    getToken,
    setLoadingAuth: setLoading,
    setLoggedIn
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
