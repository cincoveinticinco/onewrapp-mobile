import React, { useContext, useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Company, User } from '../../interfaces/user.types';
import { useRxData } from 'rxdb-hooks';
import DatabaseContext from '../../context/Database.context';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
  permissionType?: number; 
  unauthorizedRoute: string// El permiso necesario para acceder a la ruta
}

export enum PermisionTypes {
  READ = 0,
  READ_AND_WRITE = 1,
}

// Ruta protegida basada en permisos
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, permissionType, unauthorizedRoute, ...rest }) => {
  
  const { oneWrapDb } = useContext(DatabaseContext);
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    const user = await oneWrapDb?.user.findOne().exec();
    setUser(user);
    console.log(user);
    return false;
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Route
      {...rest}
      render={(props) =>
        permissionType ? (
          <Component {...props} permissionType={permissionType} />
        ) : (
          <Redirect to={unauthorizedRoute} />
        )
      }
    />
  );
};

export default ProtectedRoute;
