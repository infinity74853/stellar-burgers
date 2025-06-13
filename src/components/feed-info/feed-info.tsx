import { FC } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

export type FeedInfoProps = {
  orders: TOrder[];
  total: number;
  today: number;
};

export const FeedInfo: FC<FeedInfoProps> = ({ orders, total, today }) => {
  const getOrders = (status: string): number[] =>
    orders
      .filter((item) => item.status === status)
      .map((item) => item.number)
      .slice(0, 20);

  const readyOrders = getOrders('done');
  const pendingOrders = getOrders('pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday: today }}
    />
  );
};
