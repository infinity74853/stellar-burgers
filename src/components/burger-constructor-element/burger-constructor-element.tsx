import React, { FC, memo } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { moveIngredient } from '../../services/slices/burgerConstructorSlice';
import { useDispatch } from '../../services/store';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const [{ isDragging }, drag] = useDrag({
      type: 'constructor-ingredient', // только для внутреннего перемещения
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    });

    const [, drop] = useDrop({
      accept: 'constructor-ingredient',
      hover: (item: { index: number }) => {
        if (item.index === index) return;

        dispatch(moveIngredient({ from: item.index, to: index }));
        item.index = index;
      }
    });

    const handleMoveUp = () => {
      if (index > 0) {
        dispatch(moveIngredient({ from: index, to: index - 1 }));
      }
    };

    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        dispatch(moveIngredient({ from: index, to: index + 1 }));
      }
    };

    const handleClose = () => {
      // Логика удаления
    };

    return (
      <div ref={(node) => drag(drop(node))}>
        <BurgerConstructorElementUI
          ingredient={ingredient}
          index={index}
          totalItems={totalItems}
          handleMoveUp={handleMoveUp}
          handleMoveDown={handleMoveDown}
          handleClose={handleClose}
        />
      </div>
    );
  }
);
