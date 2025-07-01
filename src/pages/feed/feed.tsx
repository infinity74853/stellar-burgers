import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getFeeds,
  selectFeed,
  selectFeedLoaded
} from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, total, totalToday, loading } = useSelector(selectFeed);
  const loaded = useSelector(selectFeedLoaded);

  useEffect(() => {
    if (!loaded) {
      dispatch(getFeeds());
    }
  }, [dispatch, loaded]);

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
