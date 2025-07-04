import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export type TConstructorIngredient = TIngredient & {
  id: string;
};

type TBurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: Array<TConstructorIngredient>;
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: {
      reducer: (state, action: PayloadAction<TIngredient>) => {
        state.bun = action.payload;
      },
      prepare: (ingredient: TIngredient) => ({ payload: ingredient })
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: nanoid()
        }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      const indexToRemove = Number(action.payload);
      state.ingredients = state.ingredients.filter(
        (_, index) => index !== indexToRemove
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      const [moved] = state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, moved);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  addBun
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
