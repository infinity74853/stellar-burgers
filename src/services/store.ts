import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredientsReducer from './slices/ingredientsSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';
import feedReducer from './slices/feedSlice';
import orderHistoryReducer from './slices/orderHistorySlice';
import burgerConstructorReducer from './slices/burgerConstructorSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  order: orderReducer,
  user: userReducer,
  feed: feedReducer,
  orderHistory: orderHistoryReducer,
  burgerConstructor: burgerConstructorReducer
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
