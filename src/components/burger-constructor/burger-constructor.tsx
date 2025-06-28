import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  addIngredient as addIngredientAction,
  addBun,
  moveIngredient
} from '../../services/slices/burgerConstructorSlice';

export const BurgerConstructor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bun, ingredients } = useSelector(
    (state: any) => state.burgerConstructor
  );

  const constructorItems = {
    bun,
    ingredients
  };

  const price = React.useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (total: number, item: TIngredient) => total + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  const onOrderClick = () => {
    // Логика оформления заказа
  };

  const closeOrderModal = () => {
    // Логика закрытия модального окна
  };

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
    <BurgerConstructorUI
      constructorItems={constructorItems}
      price={price}
      orderRequest={false}
      orderModalData={null}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      moveIngredient={moveItem}
      onAddIngredient={handleAddIngredient}
    />
  );
};
