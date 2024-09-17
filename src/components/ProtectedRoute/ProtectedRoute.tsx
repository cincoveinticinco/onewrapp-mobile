import React from 'react';
import { Route, Redirect } from 'react-router-dom';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
  permissionType?: any;
  unauthorizedRoute: string;
  additionalProps?: Record<string, any>; // Objeto que contiene las propiedades adicionales
}

export enum PermisionTypes {
  READ = 0,
  READ_AND_WRITE = 1,
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  permissionType,
  unauthorizedRoute,
  additionalProps = {}, // Se inicializa con un objeto vacío si no se pasa
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => (permissionType === PermisionTypes.READ || permissionType === PermisionTypes.READ_AND_WRITE ? (
      <Component {...props} {...additionalProps} permissionType={permissionType} />
    ) : (
      <Redirect to={unauthorizedRoute} />
    ))}
  />
);

export default ProtectedRoute;
