import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

// Тип для начинки в конструкторе — с уникальным ID
export type TConstructorIngredient = TIngredient & {
  id: string;
};

// Состояние конструктора бургера
type TBurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: Array<TConstructorIngredient>;
};

// Начальное состояние
const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: []
};

// Создание слайса
export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // Добавление булки
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },

    // Добавление ингредиента (с соусами и начинками)
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const id = crypto.randomUUID(); // Генерируем уникальный ID
      state.ingredients.push({ ...action.payload, id });
    },

    // Удаление ингредиента по индексу
    removeIngredient: (state, action: PayloadAction<string>) => {
      const indexToRemove = Number(action.payload);
      state.ingredients = state.ingredients.filter(
        (_, index) => index !== indexToRemove
      );
    },

    // Перемещение ингредиентов в списке
    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      const [moved] = state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, moved);
    },

    // Очистка конструктора
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

// Экспортируем экшны
export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  addBun
} = burgerConstructorSlice.actions;

// Экспортируем редьюсер
export default burgerConstructorSlice.reducer;
