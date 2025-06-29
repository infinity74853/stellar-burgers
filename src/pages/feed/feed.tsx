import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getFeeds, selectFeed } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, total, totalToday, loading } = useSelector(selectFeed);

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  if (loading || !orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => dispatch(getFeeds())}
      total={total}
      today={totalToday}
    />
  );
};
