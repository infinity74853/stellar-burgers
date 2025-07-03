import { FC, ReactElement } from 'react';
import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../../services/store';
import { Preloader } from '../ui/preloader/preloader';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const user = useSelector((state: RootState) => state.user.user);
  const isAuthChecked = useSelector(
    (state: RootState) => state.user.isAuthChecked
  );
  const loading = useSelector((state: RootState) => state.user.loading);
  const location = useLocation();

  if (loading || !isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
