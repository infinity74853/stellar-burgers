import { TIngredient } from '@utils-types';
import { TOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: Array<TIngredient & { id: string }>;
  };
  price: number;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
  moveIngredient: (dragIndex: number, hoverIndex: number) => void;
  onAddIngredient: (ingredient: TIngredient) => void; // <-- новый пропс
};
