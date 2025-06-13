import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCookie, setCookie, deleteCookie } from '../../utils/cookie';
import {
  getUserApi,
  refreshToken,
  loginUserApi,
  registerUserApi,
  logoutApi,
  updateUserApi
} from '../../utils/burger-api';
import { TUser } from '@utils-types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  loading: false,
  error: null
};

export const register = createAsyncThunk(
  'user/register',
  async (data: { email: string; password: string; name: string }) =>
    await registerUserApi(data)
);

export const login = createAsyncThunk(
  'user/login',
  async (data: { email: string; password: string }) => {
    const res = await loginUserApi(data);
    setCookie('accessToken', res.accessToken.split('Bearer ')[1]);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TUser>) => await updateUserApi(data)
);

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { dispatch }) => {
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      try {
        const user = await getUserApi();
        dispatch(setUser(user.user));
      } catch (error) {
        try {
          const refreshData = await refreshToken();
          setCookie('accessToken', refreshData.accessToken.split('Bearer ')[1]);
          localStorage.setItem('refreshToken', refreshData.refreshToken);
          const user = await getUserApi();
          dispatch(setUser(user.user));
        } catch (refreshError) {
          dispatch(logout());
        }
      }
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthChecked = true;
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
        state.user = action.payload.user;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(checkUserAuth.fulfilled, (state) => {
        state.isAuthChecked = true;
      });
  }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
