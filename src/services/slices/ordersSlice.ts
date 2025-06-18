import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

type TOrdersState = {
  currentOrder: TOrder | null;
  orderHistory: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  currentOrder: null,
  orderHistory: [],
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk<TOrder, string[]>(
  'orders/create',
  async (ingredientIds, { rejectWithValue }) => {
    try {
      const res = await orderBurgerApi(ingredientIds);
      if (!res.success) throw new Error('Ошибка создания заказа');
      return res.order;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      );
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
    },
    resetOrderError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.orderHistory.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

// Селекторы
export const selectCurrentOrder = (state: RootState) =>
  state.orders.currentOrder;
export const selectOrderHistory = (state: RootState) =>
  state.orders.orderHistory;
export const selectOrdersLoading = (state: RootState) => state.orders.isLoading;
export const selectOrdersError = (state: RootState) => state.orders.error;

export const { clearOrder, resetOrderError } = ordersSlice.actions;
export default ordersSlice.reducer;
