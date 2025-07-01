import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

type TOrdersState = {
  currentOrder: TOrder | null;
  orderHistory: TOrder[];
  isLoading: boolean;
  error: string | null;
  loaded: boolean;
};

const initialState: TOrdersState = {
  currentOrder: null,
  orderHistory: [],
  isLoading: false,
  error: null,
  loaded: false
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

export const fetchUserOrders = createAsyncThunk<TOrder[]>(
  'orders/fetchAll',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      if (state.orderHistory.loaded) {
        return state.orderHistory.orderHistory;
      }
      const orders = await getOrdersApi();
      return orders;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Ошибка загрузки истории заказов'
      );
    }
  }
);

const orderHistorySlice = createSlice({
  name: 'orderHistory',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
    },
    resetOrderError: (state) => {
      state.error = null;
    },
    resetOrdersLoaded: (state) => {
      state.loaded = false;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentOrder = action.payload;
      state.orderHistory.unshift(action.payload);
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchUserOrders.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUserOrders.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orderHistory = action.payload;
      state.loaded = true;
    });
    builder.addCase(fetchUserOrders.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  }
});

export const selectCurrentOrder = (state: RootState) =>
  state.orderHistory.currentOrder;
export const selectOrderHistory = (state: RootState) =>
  state.orderHistory.orderHistory;
export const selectOrdersLoading = (state: RootState) =>
  state.orderHistory.isLoading;
export const selectOrdersError = (state: RootState) => state.orderHistory.error;
export const selectOrdersLoaded = (state: RootState) =>
  state.orderHistory.loaded;

export const { clearOrder, resetOrderError, resetOrdersLoaded } =
  orderHistorySlice.actions;
export default orderHistorySlice.reducer;
