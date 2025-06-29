import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '@utils-types';
import { RootState } from '../store';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
  loaded: boolean;
  currentIngredient: TIngredient | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null,
  loaded: false,
  currentIngredient: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
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

export const fetchIngredientById = createAsyncThunk(
  'ingredients/fetchById',
  async (id: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const existing = state.ingredients.ingredients.find((i) => i._id === id);
    if (existing) return existing;

    try {
      const data = await getIngredientsApi();
      const ingredient = data.find((i) => i._id === id);
      if (!ingredient) throw new Error('Ингредиент не найден');
      return ingredient;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка загрузки ингредиента'
      );
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setCurrentIngredient: (state, action) => {
      if (state.currentIngredient?._id !== action.payload?._id) {
        state.currentIngredient = action.payload;
      } else {
      }
    },
    clearCurrentIngredient: (state) => {
      state.currentIngredient = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        if (!state.loaded) {
          state.isLoading = true;
          state.error = null;
        }
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
        state.loaded = true;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchIngredientById.fulfilled, (state, action) => {
        if (state.currentIngredient?._id !== action.payload._id) {
          state.currentIngredient = action.payload;
        }
      });
  }
});

export const { setCurrentIngredient, clearCurrentIngredient } =
  ingredientsSlice.actions;

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;
export const selectIngredientsLoaded = (state: RootState) =>
  state.ingredients.loaded;
export const selectCurrentIngredient = (state: RootState) =>
  state.ingredients.currentIngredient;

export default ingredientsSlice.reducer;
