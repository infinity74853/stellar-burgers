import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchUserOrders,
  selectOrderHistory,
  selectOrdersLoading,
  selectOrdersError
} from '../../services/slices/orderHistorySlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrderHistory);
  const isLoading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
