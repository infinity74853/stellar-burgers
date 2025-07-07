import { getFeeds } from './feedSlice';
import { feedSlice } from './feedSlice';
import { TOrder } from '@utils-types';

describe('Тесты для редьюсера feedSlice', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null,
    currentOrder: null,
    loaded: false
  };

  const mockOrder: TOrder = {
    _id: '6614c7b497ede0001d064a8a',
    ingredients: [
      '60d3b41abdacab0026a733c6',
      '60d3b41abdacab0026a733cd',
      '60d3b41abdacab0026a733c6'
    ],
    status: 'done',
    name: 'Space флюоресцентный бургер',
    createdAt: '2024-04-09T14:25:24.811Z',
    updatedAt: '2024-04-09T14:25:25.033Z',
    number: 37377
  };

  const mockFeedResponse = {
    orders: [mockOrder],
    total: 100,
    totalToday: 10
  };

  it('should handle initial state', () => {
    expect(feedSlice.reducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('should handle setCurrentOrder', () => {
    const actual = feedSlice.reducer(
      initialState,
      feedSlice.actions.setCurrentOrder(mockOrder)
    );
    expect(actual.currentOrder).toEqual(mockOrder);
  });

  it('should handle clearCurrentOrder', () => {
    const stateWithOrder = {
      ...initialState,
      currentOrder: mockOrder
    };
    const actual = feedSlice.reducer(
      stateWithOrder,
      feedSlice.actions.clearCurrentOrder()
    );
    expect(actual.currentOrder).toBeNull();
  });

  it('should handle updateOrder', () => {
    const stateWithOrders = {
      ...initialState,
      orders: [mockOrder]
    };
    const updatedOrder = {
      ...mockOrder,
      status: 'pending'
    };
    const actual = feedSlice.reducer(
      stateWithOrders,
      feedSlice.actions.updateOrder(updatedOrder)
    );
    expect(actual.orders[0].status).toBe('pending');
  });

  it('should handle resetFeedLoaded', () => {
    const stateWithLoaded = {
      ...initialState,
      loaded: true
    };
    const actual = feedSlice.reducer(
      stateWithLoaded,
      feedSlice.actions.resetFeedLoaded()
    );
    expect(actual.loaded).toBe(false);
  });

  describe('extraReducers', () => {
    it('should set loading to true on getFeeds.pending', () => {
      const action = { type: getFeeds.pending.type };
      const state = feedSlice.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('should handle getFeeds.fulfilled', () => {
      const action = {
        type: getFeeds.fulfilled.type,
        payload: mockFeedResponse
      };
      const state = feedSlice.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        orders: mockFeedResponse.orders,
        total: mockFeedResponse.total,
        totalToday: mockFeedResponse.totalToday,
        loaded: true,
        loading: false
      });
    });

    it('should update currentOrder if it exists when getFeeds.fulfilled', () => {
      const stateWithCurrentOrder = {
        ...initialState,
        currentOrder: mockOrder
      };
      const updatedOrder = {
        ...mockOrder,
        status: 'pending'
      };
      const action = {
        type: getFeeds.fulfilled.type,
        payload: {
          ...mockFeedResponse,
          orders: [updatedOrder]
        }
      };
      const state = feedSlice.reducer(stateWithCurrentOrder, action);
      expect(state.currentOrder).toEqual(updatedOrder);
    });

    it('should handle getFeeds.rejected', () => {
      const errorMessage = 'Failed to fetch feeds';
      const action = {
        type: getFeeds.rejected.type,
        error: { message: errorMessage }
      };
      const state = feedSlice.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage
      });
    });
  });
});
