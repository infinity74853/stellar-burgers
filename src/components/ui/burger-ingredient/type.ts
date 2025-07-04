import { TIngredient } from '@utils-types';
import { Location } from 'history';

export type TBurgerIngredientUIProps = {
  ingredient: TIngredient;
  count?: number;
  handleAdd: () => void;
  locationState?: { background: Location };
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick?: () => void;
};
