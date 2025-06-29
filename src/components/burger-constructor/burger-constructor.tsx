import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  createOrder,
  clearOrder
} from '../../services/slices/orderHistorySlice';
import {
  clearConstructor,
  moveIngredient,
  addIngredient as addIngredientAction,
  addBun
} from '../../services/slices/burgerConstructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Получаем данные из хранилища
  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
  const { currentOrder, isLoading: orderRequest } = useSelector(
    (state) => state.orders
  );
  const { user } = useSelector((state) => state.user);

  // Формируем объект для UI компонента
  const constructorItems = {
    bun,
    ingredients
  };

  // Обработчик оформления заказа
  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!bun || orderRequest) return;

    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      })
      .catch((error) => {
        console.error('Ошибка при создании заказа:', error);
      });
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (total: number, item: TIngredient) => total + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  // Передаём функцию перемещения в UI-компонент
  const moveItem = (dragIndex: number, hoverIndex: number) => {
    dispatch(moveIngredient({ from: dragIndex, to: hoverIndex }));
  };

  // Передаём функцию добавления через drag and drop
  const handleAddIngredient = (ingredient: TIngredient) => {
    if (ingredient.type === 'bun') {
      dispatch(addBun(ingredient));
    } else {
      dispatch(addIngredientAction(ingredient));
    }
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={currentOrder}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      moveIngredient={moveItem}
      onAddIngredient={handleAddIngredient}
    />
  );
};
