import React, { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import {
  addIngredient,
  addBun
} from '../../services/slices/burgerConstructorSlice';
import { setCurrentIngredient } from '../../services/slices/ingredientsSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(addBun(ingredient));
      } else {
        dispatch(addIngredient(ingredient));
      }
    };

    const handleClick = () => {
      dispatch(setCurrentIngredient(ingredient));
      navigate(`/ingredients/${ingredient._id}`, {
        state: { background: location }
      });
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.setData('ingredient', JSON.stringify(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
        onClick={handleClick}
        onDragStart={handleDragStart}
      />
    );
  }
);
