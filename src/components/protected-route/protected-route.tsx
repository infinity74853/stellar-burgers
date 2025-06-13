import { FC, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../../services/store';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  children: ReactElement;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  // Используем RootState для типизации
  const user = useSelector((state: RootState) => state.user);
  const location = useLocation();

  if (onlyUnAuth && user) {
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
