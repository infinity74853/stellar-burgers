import { FC, useMemo, useCallback } from 'react';
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
import { useDrop } from 'react-dnd';
import styles from './burger-constructor.module.css';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
  const { currentOrder, isLoading: orderRequest } = useSelector(
    (state) => state.orders
  );
  const { user } = useSelector((state) => state.user);

  const [{ isHover }, dropTarget] = useDrop<
    TIngredient,
    void,
    { isHover: boolean }
  >({
    accept: 'ingredient',
    collect: (monitor) => ({
      isHover: monitor.isOver()
    }),
    drop: (item: TIngredient) => {
      handleAddIngredient(item);
    }
  });

  const constructorItems = {
    bun,
    ingredients
  };

  const onOrderClick = useCallback(() => {
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
  }, [user, bun, ingredients, orderRequest, dispatch, navigate]);

  const closeOrderModal = useCallback(() => {
    dispatch(clearOrder());
  }, [dispatch]);

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (total: number, item: TIngredient) => total + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  const moveItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      dispatch(moveIngredient({ from: dragIndex, to: hoverIndex }));
    },
    [dispatch]
  );

  const handleAddIngredient = useCallback(
    (ingredient: TIngredient) => {
      if (ingredient.type === 'bun') {
        dispatch(addBun(ingredient));
      } else {
        dispatch(addIngredientAction(ingredient));
      }
    },
    [dispatch]
  );

  return (
    <div ref={dropTarget} style={{ opacity: isHover ? 0.8 : 1 }}>
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
    </div>
  );
};
