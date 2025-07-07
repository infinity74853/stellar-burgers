import { AnyAction } from '@reduxjs/toolkit';
import store from './store';

describe('Тесты для store: проверка инициализации и работы хранилища', () => {
  it('должен возвращать корректное начальное состояние', () => {
    const state = store.getState();

    expect(state).toEqual({
      ingredients: expect.any(Object),
      orderHistory: expect.any(Object),
      user: expect.any(Object),
      feed: expect.any(Object),
      burgerConstructor: expect.any(Object)
    });
  });

  it('должен обрабатывать неизвестный экшен без изменений состояния', () => {
    const initialState = store.getState();
    const unknownAction: AnyAction = { type: 'UNKNOWN_ACTION' };

    store.dispatch(unknownAction);
    const newState = store.getState();

    expect(newState).toEqual(initialState);
  });
});
