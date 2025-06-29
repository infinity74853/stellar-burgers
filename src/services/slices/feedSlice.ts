import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
  currentOrder: TOrder | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null,
  currentOrder: null
};

export const getFeeds = createAsyncThunk('feed/get', async () => {
  const response = await getFeedsApi();
  return response;
});

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    updateOrder: (state, action) => {
      const index = state.orders.findIndex(
        (order) => order._id === action.payload._id
      );
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;

        if (state.currentOrder) {
          const updatedOrder = action.payload.orders.find(
            (order) => order._id === state.currentOrder!._id
          );
          if (updatedOrder) {
            state.currentOrder = updatedOrder;
          }
        }
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты заказов';
      });
  }
});

export const { setCurrentOrder, clearCurrentOrder, updateOrder } =
  feedSlice.actions;

export const selectFeed = (state: { feed: TFeedState }) => state.feed;
export const selectOrders = (state: { feed: TFeedState }) => state.feed.orders;
export const selectTotal = (state: { feed: TFeedState }) => state.feed.total;
export const selectTotalToday = (state: { feed: TFeedState }) =>
  state.feed.totalToday;
export const selectCurrentOrder = (state: { feed: TFeedState }) =>
  state.feed.currentOrder;

export default feedSlice.reducer;
