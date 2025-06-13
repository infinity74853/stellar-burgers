import { useSelector } from '../../services/store';
import styles from './constructor-page.module.css';
import { BurgerIngredients, BurgerConstructor } from '@components';
import { Preloader } from '../../components/ui/preloader'; // Исправленный импорт
import { FC } from 'react';

export const ConstructorPage: FC = () => {
  // Используем правильное имя из стора
  const { isLoading } = useSelector((state) => state.ingredients);

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
