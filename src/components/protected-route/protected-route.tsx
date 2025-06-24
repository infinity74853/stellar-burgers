import { FC, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../../services/store';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const user = useSelector((state: RootState) => state.user.user);
  const location = useLocation();

  if (onlyUnAuth && user) {
    // Если маршрут только для незалогиненных, а юзер есть — редирект
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  if (!onlyUnAuth && !user) {
    // Если маршрут требует авторизации, а юзера нет — на логин
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Всё ок — показываем контент
  return children;
};
