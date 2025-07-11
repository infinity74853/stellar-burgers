import reducer, {
  createOrder,
  fetchUserOrders,
  clearOrder,
  resetOrderError,
  resetOrdersLoaded
} from './orderHistorySlice';
import { TOrder } from '@utils-types';

// Получаем начальное состояние
const initialState = {
  currentOrder: null,
  orderHistory: [],
  isLoading: false,
  error: null,
  loaded: false
};

describe('Тесты для orderHistorySlice', () => {
  describe('Проверка начального состояния', () => {
    it('должен возвращать initialState при первом вызове', () => {
      const result = reducer(undefined, { type: '' });
      expect(result).toEqual(initialState);
    });
  });

  describe('Синхронные экшены', () => {
    it('clearOrder должен очищать currentOrder', () => {
      const state = { ...initialState, currentOrder: {} as TOrder };
      const result = reducer(state, clearOrder());
      expect(result.currentOrder).toBeNull();
    });

    it('resetOrderError должен сбрасывать ошибку', () => {
      const state = { ...initialState, error: 'Error' };
      const result = reducer(state, resetOrderError());
      expect(result.error).toBeNull();
    });

    it('resetOrdersLoaded должен сбрасывать флаг loaded', () => {
      const state = { ...initialState, loaded: true };
      const result = reducer(state, resetOrdersLoaded());
      expect(result.loaded).toBe(false);
    });
  });

  describe('Асинхронные экшены: createOrder', () => {
    it('pending должен устанавливать isLoading', () => {
      const action = { type: createOrder.pending.type };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(true);
    });

    it('fulfilled должен добавлять заказ', () => {
      const mockOrder = { _id: '1', number: 1 } as TOrder;
      const action = { type: createOrder.fulfilled.type, payload: mockOrder };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.currentOrder).toEqual(mockOrder);
      expect(state.orderHistory[0]).toEqual(mockOrder);
    });

    it('rejected должен сохранять ошибку', () => {
      const error = 'Create order error';
      const action = { type: createOrder.rejected.type, payload: error };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(error);
    });
  });

  describe('Асинхронные экшены: fetchUserOrders', () => {
    it('pending должен устанавливать isLoading', () => {
      const action = { type: fetchUserOrders.pending.type };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(true);
    });

    it('fulfilled должен сохранять историю заказов', () => {
      const mockOrders = [
        { _id: '1', number: 1 },
        { _id: '2', number: 2 }
      ] as TOrder[];
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: mockOrders
      };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.orderHistory).toEqual(mockOrders);
      expect(state.loaded).toBe(true);
    });

    it('rejected должен сохранять ошибку', () => {
      const error = 'Fetch orders error';
      const action = { type: fetchUserOrders.rejected.type, payload: error };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(error);
    });
  });
});
