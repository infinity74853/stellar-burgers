// src/pages/profile/profile.tsx
import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser } from '../../services/slices/userSlice';
import { fetchUserOrders } from '../../services/slices/orderHistorySlice';
import { getAccessToken } from '../../utils/cookie';
import { useNavigate } from 'react-router-dom';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    // Загружаем данные пользователя при монтировании
    if (!user) {
      navigate('/login');
      return;
    }

    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });

    // Загружаем историю заказов
    const accessToken = getAccessToken();
    if (accessToken) {
      dispatch(fetchUserOrders());
    }
  }, [user, dispatch, navigate]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!isFormChanged || !user) return;

    const accessToken = getAccessToken();
    if (!accessToken) {
      console.error('Токен отсутствует');
      navigate('/login');
      return;
    }

    try {
      await dispatch(
        updateUser({
          name: formValue.name,
          email: formValue.email,
          ...(formValue.password && { password: formValue.password })
        })
      ).unwrap();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value
    });
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
