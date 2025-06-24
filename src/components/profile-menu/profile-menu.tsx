import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logout } from '../../services/slices/userSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Диспатчим действие выхода и ждем его завершения
      await dispatch(logout()).unwrap();
      // После успешного выхода перенаправляем на страницу входа
      navigate('/login');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      // Можно добавить обработку ошибки (например, показать уведомление)
    }
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
