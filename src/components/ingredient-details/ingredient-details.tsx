import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { selectCurrentIngredient } from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const ingredientData = useSelector(selectCurrentIngredient);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
