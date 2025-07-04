import { TIngredient } from '@utils-types';

export type TConstructorIngredient = TIngredient & {
  id: string;
};

export interface BurgerConstructorElementProps {
  ingredient: TConstructorIngredient;
  index: number;
  totalItems: number;
  moveIngredient?: (dragIndex: number, hoverIndex: number) => void;
}

export interface BurgerConstructorElementUIProps {
  ingredient: TConstructorIngredient;
  index: number;
  totalItems: number;
  handleMoveUp: () => void;
  handleMoveDown: () => void;
  handleClose: () => void;
}
