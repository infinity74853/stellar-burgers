import { Location } from 'react-router-dom';
import { TIngredient } from '@utils-types';

export type OrderCardUIProps = {
  orderInfo: {
    ingredientsInfo: TIngredient[];
    ingredientsToShow: TIngredient[];
    remains: number;
    total: number;
    date: Date;
    _id: string;
    status: string;
    name: string;
    number: number;
    ingredients: string[];
    createdAt: string;
    updatedAt: string;
  };
  maxIngredients: number;
  locationState: { background: Location };
};
