import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { selectOrders } from '../../services/slices/feedSlice';
import { selectOrderHistory } from '../../services/slices/orderHistorySlice';
import { TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const feedOrders = useSelector(selectOrders);
  const historyOrders = useSelector(selectOrderHistory);
  const ingredients = useSelector(selectIngredients);

  const orderData =
    feedOrders.find((order) => order.number === parseInt(number!)) ||
    historyOrders.find((order) => order.number === parseInt(number!));

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!ingredients.length) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <p>Заказ #{number} не найден</p>;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
