import React, { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import styles from './burger-ingredient.module.css';

import {
  Counter,
  CurrencyIcon,
  AddButton
} from '@zlden/react-developer-burger-ui-components';

import { TBurgerIngredientUIProps } from './type';

export const BurgerIngredientUI: FC<TBurgerIngredientUIProps> = memo(
  ({ ingredient, count, handleAdd, locationState, onDragStart, onClick }) => {
    const { image, price, name, _id } = ingredient;

    return (
      <li className={styles.container}>
        <div
          draggable
          onDragStart={onDragStart}
          className={styles.draggable}
          onClick={onClick}
        >
          <Link
            className={styles.article}
            to={`/ingredients/${_id}`}
            state={locationState}
            onClick={(e) => e.preventDefault()}
          >
            {count && <Counter count={count} />}
            <div className={styles.imageWrapper}>
              <img
                className={styles.img}
                src={image}
                alt='картинка ингредиента.'
              />
            </div>
            <div className={`${styles.cost} mt-2 mb-2`}>
              <p className='text text_type_digits-default mr-2'>{price}</p>
              <CurrencyIcon type='primary' />
            </div>
            <p className={`text text_type_main-default ${styles.text}`}>
              {name}
            </p>
          </Link>
          <AddButton
            text='Добавить'
            onClick={(e) => {
              e.stopPropagation();
              handleAdd();
            }}
            extraClass={`${styles.addButton} mt-8`}
          />
        </div>
      </li>
    );
  }
);
