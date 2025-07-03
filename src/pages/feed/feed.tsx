import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getFeeds,
  selectFeed,
  resetFeedLoaded
} from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, total, totalToday, loading } = useSelector(selectFeed);

  useEffect(() => {
    dispatch(getFeeds());
    return () => {
      dispatch(resetFeedLoaded());
    };
  }, [dispatch]);

  if (loading || !orders.length) {
    return <Preloader />;
  }

  const handleRefresh = () => {
    dispatch(resetFeedLoaded());
    dispatch(getFeeds());
  };

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={handleRefresh}
      total={total}
      today={totalToday}
    />
  );
};
