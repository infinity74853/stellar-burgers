import { TIngredient } from '@utils-types';

// Расширяем тип ингредиента уникальным ID
export type TConstructorIngredient = TIngredient & {
  id: string;
};

// Пропсы для контейнерного компонента
export interface BurgerConstructorElementProps {
  ingredient: TConstructorIngredient;
  index: number;
  totalItems: number;
  moveIngredient?: (dragIndex: number, hoverIndex: number) => void; // ✅ Добавили
}

// Пропсы для UI-компонента
export interface BurgerConstructorElementUIProps {
  ingredient: TConstructorIngredient;
  index: number;
  totalItems: number;
  handleMoveUp: () => void;
  handleMoveDown: () => void;
  handleClose: () => void;
}
