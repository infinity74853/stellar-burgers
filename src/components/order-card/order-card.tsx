import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { TOrder } from '@utils-types';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';

const maxIngredients = 6;

type OrderCardProps = {
  order: TOrder;
};

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const ingredients = useSelector((state) => state.ingredients.ingredients);

  const orderInfo = useMemo(() => {
    if (!ingredients.length || !order?.ingredients?.length) return null;

    try {
      const ingredientsInfo = order.ingredients.reduce(
        (acc: TIngredient[], item: string) => {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) return [...acc, ingredient];
          return acc;
        },
        []
      );

      const total = ingredientsInfo.reduce(
        (acc, item) => acc + (item?.price || 0),
        0
      );

      const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);
      const remains =
        ingredientsInfo.length > maxIngredients
          ? ingredientsInfo.length - maxIngredients
          : 0;

      const date = new Date(order.createdAt);

      return {
        ...order,
        ingredientsInfo,
        ingredientsToShow,
        remains,
        total,
        date
      };
    } catch (error) {
      console.error('Ошибка при обработке данных заказа:', error);
      return null;
    }
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
