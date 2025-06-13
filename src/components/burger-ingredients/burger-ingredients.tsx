import { useState, useRef, useEffect, FC, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector } from '../../services/store';
import { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';

export const BurgerIngredients: FC = () => {
  // Получаем ингредиенты из Redux store
  const { ingredients, isLoading } = useSelector((state) => state.ingredients);

  // Используем пустой массив по умолчанию
  const safeIngredients = useMemo(
    () => (Array.isArray(ingredients) ? ingredients : []),
    [ingredients]
  );

  // Фильтруем ингредиенты по категориям
  const buns = useMemo(
    () => safeIngredients.filter((ingredient) => ingredient.type === 'bun'),
    [safeIngredients]
  );

  const mains = useMemo(
    () => safeIngredients.filter((ingredient) => ingredient.type === 'main'),
    [safeIngredients]
  );

  const sauces = useMemo(
    () => safeIngredients.filter((ingredient) => ingredient.type === 'sauce'),
    [safeIngredients]
  );

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Показываем прелоадер во время загрузки
  if (isLoading) {
    return <div>Загрузка ингредиентов...</div>;
  }

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
