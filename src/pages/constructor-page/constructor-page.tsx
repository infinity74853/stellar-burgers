import { useSelector, useDispatch } from '../../services/store';
import styles from './constructor-page.module.css';
import { BurgerIngredients, BurgerConstructor } from '@components';
import { Preloader } from '../../components/ui/preloader';
import { FC, useEffect } from 'react';
import { clearCurrentIngredient } from '../../services/slices/ingredientsSlice';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.ingredients);

  useEffect(
    () => () => {
      dispatch(clearCurrentIngredient());
    },
    [dispatch]
  );

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
