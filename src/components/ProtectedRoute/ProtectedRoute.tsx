import React from 'react';
import { Route, Redirect } from 'react-router-dom';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
  permissionType?: any;
  unauthorizedRoute: string
}

export enum PermisionTypes {
  READ = 0,
  READ_AND_WRITE = 1,
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component, permissionType, unauthorizedRoute, ...rest
}) => (
  <Route
    {...rest}
    render={(props) => (permissionType === 0 || permissionType === 1 ? (
      <Component {...props} permissionType={permissionType} />
    ) : (
      <Redirect to={unauthorizedRoute} />
    ))}
  />
);

export default ProtectedRoute;
