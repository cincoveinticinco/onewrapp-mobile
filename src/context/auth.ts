import React, { useContext } from 'react';

export const AuthContext = React.createContext({ loggedIn: false, user: null });

export function useAuth() {
  return useContext(AuthContext);
}
