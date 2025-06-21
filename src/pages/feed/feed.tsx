import { Preloader } from '../../components/ui/preloader';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeeds } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, total, totalToday, loading, error } = useSelector(
    (state) => state.feed
  );

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    console.error('Error loading feeds:', error);
    return <div>Error: {error}</div>;
  }

  return (
    <FeedUI
      orders={orders || []} // Добавляем fallback на случай undefined
      handleGetFeeds={() => dispatch(getFeeds())}
      total={total}
      today={totalToday}
    />
  );
};
