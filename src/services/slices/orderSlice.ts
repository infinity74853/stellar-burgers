import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api'; // Используем ваш API метод
import { TOrder } from '@utils-types';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

export const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      // Возвращаем данные заказа из ответа
      return response.order;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error =
          (action.payload as Error)?.message || 'Ошибка при создании заказа';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
