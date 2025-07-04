import { FC } from 'react';
import { useSelector } from '../../services/store';
import { selectFeed } from '../../services/slices/feedSlice';
import { FeedInfoUI } from '../ui/feed-info';

export const FeedInfo: FC = () => {
  const { orders, total, totalToday } = useSelector(selectFeed);

  const getOrdersByStatus = (status: 'done' | 'pending') =>
    orders
      .filter((order) => order.status === status)
      .map((order) => order.number)
      .slice(0, 20);

  return (
    <FeedInfoUI
      readyOrders={getOrdersByStatus('done')}
      pendingOrders={getOrdersByStatus('pending')}
      feed={{ total, totalToday }}
    />
  );
};
