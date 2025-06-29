import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCookie, setCookie, deleteCookie } from '../../utils/cookie';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  logoutApi,
  updateUserApi,
  refreshToken as refreshTokenApi
} from '../../utils/burger-api';
import { TUser } from '@utils-types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isAuthenticated: false,
  loading: false,
  error: null
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error occurred';
};

export const fetchRefreshToken = createAsyncThunk(
  'user/fetchRefreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await refreshTokenApi();
      return response;
    } catch (error) {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (
    data: { email: string; password: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await registerUserApi(data);
      const accessToken = res.accessToken;
      if (typeof accessToken === 'string') {
        setCookie('accessToken', accessToken.split('Bearer ')[1], {
          expires: 20 * 60
        });
      }
      localStorage.setItem('refreshToken', res.refreshToken);
      return res.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await loginUserApi(data);
      const accessToken = res.accessToken;
      if (typeof accessToken === 'string') {
        setCookie('accessToken', accessToken.split('Bearer ')[1], {
          expires: 20 * 60
        });
      }
      localStorage.setItem('refreshToken', res.refreshToken);
      return res.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка авторизации'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await logoutApi();
      }
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return { success: true };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (
    data: { name: string; email: string; password?: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await updateUserApi(data);
      return res.user;
    } catch (error) {
      if (getErrorMessage(error) === 'jwt expired') {
        try {
          const refreshData = await dispatch(fetchRefreshToken()).unwrap();
          setCookie(
            'accessToken',
            refreshData.accessToken.split('Bearer ')[1],
            {
              expires: 20 * 60
            }
          );
          localStorage.setItem('refreshToken', refreshData.refreshToken);

          const res = await updateUserApi(data);
          return res.user;
        } catch (refreshError) {
          return rejectWithValue(getErrorMessage(refreshError));
        }
      }
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { dispatch }) => {
    try {
      const token = getCookie('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!token && refreshToken) {
        const refreshData = await dispatch(fetchRefreshToken()).unwrap();

        if (typeof refreshData.accessToken === 'string') {
          setCookie(
            'accessToken',
            refreshData.accessToken.split('Bearer ')[1],
            {
              expires: 20 * 60
            }
          );
        }

        localStorage.setItem('refreshToken', refreshData.refreshToken);
      }

      const res = await getUserApi();
      return res.user;
    } catch (error) {
      await dispatch(logout());
      throw error;
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        if (typeof action.payload === 'string') {
          state.error = action.payload;
        } else {
          const payload = action.payload as { message?: string };
          state.error = payload?.message || 'Ошибка выхода';
        }
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(checkUserAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      });
  }
});

export const { clearError } = userSlice.actions;
export const selectUser = (state: { user: TUserState }) => state.user.user;
export const selectAuthChecked = (state: { user: TUserState }) =>
  state.user.isAuthChecked;
export const selectIsAuthenticated = (state: { user: TUserState }) =>
  state.user.isAuthenticated;
export default userSlice.reducer;
