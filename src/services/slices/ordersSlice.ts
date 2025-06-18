import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

interface IOrdersState {
  currentOrder: TOrder | null;
  orderHistory: TOrder[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IOrdersState = {
  currentOrder: null,
  orderHistory: [],
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredientIds: string[]) => {
    const response = await orderBurgerApi(ingredientIds);
    return response.order;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
    },
    setCurrentOrder: (state, action: PayloadAction<TOrder>) => {
      state.currentOrder = action.payload;
    },
    setOrderHistory: (state, action: PayloadAction<TOrder[]>) => {
      state.orderHistory = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
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
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create order';
      });
  }
});

export const {
  clearOrder,
  setCurrentOrder,
  setOrderHistory,
  setLoading,
  setError
} = ordersSlice.actions;

export default ordersSlice.reducer;
