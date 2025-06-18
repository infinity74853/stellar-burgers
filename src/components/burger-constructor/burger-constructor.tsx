import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { createOrder, clearOrder } from '../../services/slices/ordersSlice';
import { clearConstructor } from '../../services/slices/burgerConstructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Получаем данные из хранилища
  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
  const { currentOrder, isLoading: orderRequest } = useSelector(
    (state) => state.orders
  );
  const { isAuthChecked, user } = useSelector((state) => state.user);

  // Формируем объект для UI компонента
  const constructorItems = {
    bun,
    ingredients
  };

  // Обработчик оформления заказа
  const onOrderClick = () => {
    // Если пользователь не авторизован - перенаправляем на страницу входа
    if (!user) {
      navigate('/login');
      return;
    }

    // Если нет булки или уже идет запрос - выходим
    if (!bun || orderRequest) return;

    // Формируем массив id ингредиентов (булка в начале и конце)
    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    // Отправляем запрос на создание заказа
    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then(() => {
        // После успешного создания заказа очищаем конструктор
        dispatch(clearConstructor());
      })
      .catch((error) => {
        console.error('Ошибка при создании заказа:', error);
      });
  };

  // Закрытие модального окна заказа
  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  // Вычисляем общую стоимость
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
      orderModalData={currentOrder} // Передаем текущий заказ вместо orderModalData
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
