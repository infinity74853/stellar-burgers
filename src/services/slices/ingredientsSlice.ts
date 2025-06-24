import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '@utils-types';
import { RootState } from '../store';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
  loaded: boolean; // Добавляем флаг загрузки
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null,
  loaded: false // Изначально данные не загружены
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    // Если данные уже загружены, возвращаем их
    if (state.ingredients.loaded) {
      return state.ingredients.ingredients;
    }

    try {
      const data = await getIngredientsApi();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка загрузки ингредиентов'
      );
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        // Устанавливаем isLoading только если данные ещё не загружены
        if (!state.loaded) {
          state.isLoading = true;
          state.error = null;
        }
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
        state.loaded = true; // Помечаем данные как загруженные
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

// Селекторы
export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;
export const selectIngredientsLoaded = (state: RootState) =>
  state.ingredients.loaded; // Новый селектор

export default ingredientsSlice.reducer;
