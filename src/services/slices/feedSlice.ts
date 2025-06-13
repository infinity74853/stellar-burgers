import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  today: number;
  loading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  today: 0,
  loading: false,
  error: null
};

export const getFeeds = createAsyncThunk('feed/get', async () => {
  const response = await getFeedsApi();
  return {
    orders: response.orders,
    total: response.total,
    today: response.totalToday
  };
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
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
        state.today = action.payload.today;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch feeds';
      });
  }
});

export default feedSlice.reducer;
