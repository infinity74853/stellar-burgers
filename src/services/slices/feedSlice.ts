import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
  currentOrder: TOrder | null;
  loaded: boolean;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null,
  currentOrder: null,
  loaded: false
};

export const getFeeds = createAsyncThunk(
  'feed/get',
  async (_, { getState }) => {
    const state = getState() as RootState;
    if (state.feed.loaded) {
      return {
        orders: state.feed.orders,
        total: state.feed.total,
        totalToday: state.feed.totalToday
      };
    }
    const response = await getFeedsApi();
    return response;
  }
);

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
    },
    resetFeedLoaded: (state) => {
      state.loaded = false;
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
        state.loaded = true;

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

export const {
  setCurrentOrder,
  clearCurrentOrder,
  updateOrder,
  resetFeedLoaded
} = feedSlice.actions;

export const selectFeed = (state: RootState) => state.feed;
export const selectOrders = (state: RootState) => state.feed.orders;
export const selectTotal = (state: RootState) => state.feed.total;
export const selectTotalToday = (state: RootState) => state.feed.totalToday;
export const selectCurrentOrder = (state: RootState) => state.feed.currentOrder;
export const selectFeedLoaded = (state: RootState) => state.feed.loaded;

export default feedSlice.reducer;
