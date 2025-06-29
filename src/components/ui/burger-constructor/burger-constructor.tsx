import React, { FC, useCallback } from 'react';
import {
  Button,
  ConstructorElement,
  CurrencyIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps } from './type';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorElement } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';
import { Modal } from '../../modal/modal';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  constructorItems,
  orderRequest,
  price,
  orderModalData,
  onOrderClick,
  closeOrderModal,
  moveIngredient,
  onAddIngredient
}) => {
  const navigate = useNavigate();

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      const data = e.dataTransfer.getData('ingredient');
      if (!data) {
        console.error('Данные пустые');
        return;
      }

      try {
        const ingredient = JSON.parse(data);

        if (ingredient.type === 'bun') {
          onAddIngredient({ ...ingredient, type: 'bun' });
        } else {
          onAddIngredient(ingredient);
        }
      } catch (error) {
        console.error('Ошибка парсинга ингредиента:', error);
      }
    },
    [onAddIngredient]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  // Константы для ограничения высоты
  const INGREDIENT_HEIGHT = 80;
  const MAX_VISIBLE_INGREDIENTS = 5;
  const MAX_INGREDIENTS_HEIGHT = INGREDIENT_HEIGHT * MAX_VISIBLE_INGREDIENTS;

  return (
    <section
      className={styles.burger_constructor}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Верхняя булка */}
      {constructorItems.bun ? (
        <div className={`${styles.element} mb-4 mr-4`}>
          <ConstructorElement
            type='top'
            isLocked
            text={`${constructorItems.bun.name} (верх)`}
            price={constructorItems.bun.price}
            thumbnail={constructorItems.bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.noBuns} ${styles.noBunsTop} ml-8 mb-4 mr-5 text text_type_main-default`}
        >
          Выберите булки
        </div>
      )}

      {/* Список начинок с ограниченной высотой и скроллом */}
      <ul
        className={styles.elements}
        style={{
          maxHeight: `${MAX_INGREDIENTS_HEIGHT}px`,
          overflowY: 'auto',
          scrollbarWidth: 'thin'
        }}
      >
        {constructorItems.ingredients.length > 0 ? (
          constructorItems.ingredients.map(
            (item: TConstructorIngredient, index: number) => (
              <BurgerConstructorElement
                key={item.id}
                ingredient={item}
                index={index}
                totalItems={constructorItems.ingredients.length}
                moveIngredient={moveIngredient}
              />
            )
          )
        ) : (
          <div
            className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
          >
            Выберите начинку
          </div>
        )}
      </ul>

      {/* Нижняя булка */}
      {constructorItems.bun ? (
        <div className={`${styles.element} mt-4 mr-4`}>
          <ConstructorElement
            type='bottom'
            isLocked
            text={`${constructorItems.bun.name} (низ)`}
            price={constructorItems.bun.price}
            thumbnail={constructorItems.bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.noBuns} ${styles.noBunsBottom} ml-8 mb-4 mr-5 text text_type_main-default`}
        >
          Выберите булки
        </div>
      )}

      {/* Итого */}
      <div className={`${styles.total} mt-10 mr-4`}>
        <div className={`${styles.cost} mr-10`}>
          <p className={`text ${styles.text} mr-2`}>{price}</p>
          <CurrencyIcon type='primary' />
        </div>
        <Button
          htmlType='button'
          type='primary'
          size='large'
          children='Оформить заказ'
          onClick={onOrderClick}
        />
      </div>

      {/* Модальное окно: загрузка */}
      {orderRequest && (
        <Modal onClose={closeOrderModal} title={'Оформляем заказ...'}>
          <Preloader />
        </Modal>
      )}

      {/* Модальное окно: детали заказа */}
      {orderModalData && (
        <Modal
          onClose={closeOrderModal}
          title={orderRequest ? 'Оформляем заказ...' : ''}
        >
          <OrderDetailsUI orderNumber={orderModalData.number} />
        </Modal>
      )}
    </section>
  );
};
