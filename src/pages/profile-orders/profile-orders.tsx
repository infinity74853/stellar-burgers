import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchUserOrders,
  selectOrderHistory,
  selectOrdersLoading,
  selectOrdersError,
  selectOrdersLoaded
} from '../../services/slices/orderHistorySlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrderHistory);
  const isLoading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const loaded = useSelector(selectOrdersLoaded);

  useEffect(() => {
    if (!loaded) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, loaded]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
