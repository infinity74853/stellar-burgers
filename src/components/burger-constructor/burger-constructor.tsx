import { FC, useMemo } from 'react';
import { TIngredient } from '@utils-types'; // Используем основной тип ингредиента
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { createOrder } from '../../services/slices/orderSlice';
import { clearOrder } from '../../services/slices/orderSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();

  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
  const { orderRequest, orderModalData } = useSelector((state) => state.order);

  const constructorItems = {
    bun,
    ingredients
  };

  const onOrderClick = () => {
    if (!bun || orderRequest) return;

    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  // Исправляем вычисление цены
  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (total: number, item: TIngredient) => total + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
