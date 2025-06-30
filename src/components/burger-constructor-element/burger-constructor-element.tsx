import React, { FC, memo, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import {
  moveIngredient,
  removeIngredient
} from '../../services/slices/burgerConstructorSlice';
import { useDispatch } from '../../services/store';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag({
      type: 'constructor-ingredient',
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    });

    const [, drop] = useDrop({
      accept: 'constructor-ingredient',
      hover(item: { index: number }, monitor) {
        if (!ref.current) return;
        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) return;

        const hoverBoundingRect = ref.current.getBoundingClientRect();
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();

        if (!clientOffset) return;

        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

        dispatch(moveIngredient({ from: dragIndex, to: hoverIndex }));
        item.index = hoverIndex;
      }
    });

    drag(drop(ref));

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
      dispatch(removeIngredient(String(index)));
    };

    return (
      <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
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
