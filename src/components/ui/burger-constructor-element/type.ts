import { TIngredient } from '@utils-types';

// Тип для элемента конструктора бургера
export type TConstructorIngredient = TIngredient & {
  id: string; // Уникальный идентификатор для React key и drag-n-drop
};

// Пропсы для контейнерного компонента BurgerConstructorElement
export type BurgerConstructorElementProps = {
  ingredient: TConstructorIngredient;
  index: number;
  totalItems: number;
};

// Пропсы для UI-компонента BurgerConstructorElementUI
export type BurgerConstructorElementUIProps = {
  ingredient: TConstructorIngredient;
  index: number;
  totalItems: number;
  handleMoveUp: () => void;
  handleMoveDown: () => void;
  handleClose: () => void;
};
