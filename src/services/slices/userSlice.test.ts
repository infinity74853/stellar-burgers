import userReducer, {
  register,
  login,
  logout,
  updateUser,
  checkUserAuth,
  fetchRefreshToken,
  clearError,
  selectUser,
  selectAuthChecked,
  selectIsAuthenticated
} from '../../services/slices/userSlice';
import { TUser } from '@utils-types';

// Определяем initialState вручную, так как он не экспортируется из слайса
const initialState = {
  user: null,
  isAuthChecked: false,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Моковые данные для тестов
const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('Тесты для userSlice: редьюсеры и экшены', () => {
  it('должен возвращать начальное состояние', () => {
    expect(userReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  describe('Экшен clearError', () => {
    it('должен очищать ошибку', () => {
      const stateWithError = {
        ...initialState,
        error: 'Произошла ошибка'
      };
      const newState = userReducer(stateWithError, clearError());
      expect(newState.error).toBeNull();
    });
  });

  describe('Асинхронный экшен register', () => {
    it('должен обрабатывать pending', () => {
      const action = { type: register.pending.type };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('должен обрабатывать fulfilled', () => {
      const action = { type: register.fulfilled.type, payload: mockUser };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        user: mockUser,
        isAuthChecked: true,
        isAuthenticated: true
      });
    });

    it('должен обрабатывать rejected', () => {
      const errorMessage = 'Ошибка регистрации';
      const action = {
        type: register.rejected.type,
        payload: errorMessage
      };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage
      });
    });
  });

  describe('Асинхронный экшен login', () => {
    it('должен обрабатывать pending', () => {
      const action = { type: login.pending.type };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('должен обрабатывать fulfilled', () => {
      const action = { type: login.fulfilled.type, payload: mockUser };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        user: mockUser,
        isAuthenticated: true
      });
    });

    it('должен обрабатывать rejected', () => {
      const errorMessage = 'Ошибка авторизации';
      const action = {
        type: login.rejected.type,
        payload: errorMessage
      };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage
      });
    });
  });

  describe('Асинхронный экшен logout', () => {
    it('должен обрабатывать pending', () => {
      const action = { type: logout.pending.type };
      const state = userReducer(
        {
          ...initialState,
          user: mockUser,
          isAuthenticated: true
        },
        action
      );
      expect(state).toEqual({
        ...initialState,
        user: mockUser,
        isAuthenticated: true,
        loading: true
      });
    });

    it('должен обрабатывать fulfilled', () => {
      const action = { type: logout.fulfilled.type };
      const state = userReducer(
        {
          ...initialState,
          user: mockUser,
          isAuthenticated: true
        },
        action
      );
      expect(state).toEqual({
        ...initialState,
        loading: false,
        user: null,
        isAuthenticated: false,
        isAuthChecked: true,
        error: null
      });
    });

    it('должен обрабатывать rejected', () => {
      const errorMessage = 'Ошибка выхода';
      const action = {
        type: logout.rejected.type,
        payload: errorMessage
      };
      const state = userReducer(
        {
          ...initialState,
          user: mockUser,
          isAuthenticated: true
        },
        action
      );
      expect(state).toEqual({
        ...initialState,
        user: mockUser,
        isAuthenticated: true,
        loading: false,
        error: errorMessage
      });
    });
  });

  describe('Асинхронный экшен updateUser', () => {
    it('должен обрабатывать pending', () => {
      const action = { type: updateUser.pending.type };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('должен обрабатывать fulfilled', () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      const action = { type: updateUser.fulfilled.type, payload: updatedUser };
      const state = userReducer(
        {
          ...initialState,
          user: mockUser
        },
        action
      );
      expect(state).toEqual({
        ...initialState,
        loading: false,
        user: updatedUser
      });
    });

    it('должен обрабатывать rejected', () => {
      const errorMessage = 'Ошибка обновления';
      const action = {
        type: updateUser.rejected.type,
        payload: errorMessage
      };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage
      });
    });
  });

  describe('Асинхронный экшен checkUserAuth', () => {
    it('должен обрабатывать pending', () => {
      const action = { type: checkUserAuth.pending.type };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: true
      });
    });

    it('должен обрабатывать fulfilled', () => {
      const action = { type: checkUserAuth.fulfilled.type, payload: mockUser };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        user: mockUser,
        isAuthChecked: true,
        isAuthenticated: true
      });
    });

    it('должен обрабатывать rejected', () => {
      const action = { type: checkUserAuth.rejected.type };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        isAuthChecked: true,
        isAuthenticated: false
      });
    });
  });

  describe('Селекторы', () => {
    const mockState = {
      user: {
        user: mockUser,
        isAuthChecked: true,
        isAuthenticated: true,
        loading: false,
        error: null
      }
    };

    it('selectUser должен возвращать данные пользователя', () => {
      expect(selectUser(mockState)).toEqual(mockUser);
    });

    it('selectAuthChecked должен возвращать статус проверки авторизации', () => {
      expect(selectAuthChecked(mockState)).toBe(true);
    });

    it('selectIsAuthenticated должен возвращать статус аутентификации', () => {
      expect(selectIsAuthenticated(mockState)).toBe(true);
    });
  });
});
