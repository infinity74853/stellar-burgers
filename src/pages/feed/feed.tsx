import { Preloader } from '../../components/ui/preloader';
import { FeedUI } from '@ui-pages';
import { TIngredient, TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeeds } from '../../services/slices/feedSlice';

// Расширенный тип для заказа с дополнительными данными
type TEnrichedOrder = TOrder & {
  ingredientsData: TIngredient[];
  totalPrice: number;
};

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, total, today, loading } = useSelector((state) => state.feed);
  const ingredients = useSelector((state) => state.ingredients.ingredients);

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(getFeeds());
  };

  // Обогащаем заказы данными
  const enrichedOrders: TEnrichedOrder[] = orders.map((order) => {
    const orderIngredients = order.ingredients
      .map((id) => ingredients.find((ing: TIngredient) => ing._id === id))
      .filter(Boolean) as TIngredient[];

    const totalPrice = orderIngredients.reduce(
      (acc, ing) => acc + ing.price,
      0
    );

    return {
      ...order,
      ingredientsData: orderIngredients,
      totalPrice
    };
  });

  if (loading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={enrichedOrders}
      handleGetFeeds={handleGetFeeds}
      total={total}
      today={today}
    />
  );
};
