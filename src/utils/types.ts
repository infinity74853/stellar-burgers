// Типы для ингредиентов

export type TIngredient = {
  _id: string;
  name: string;
  type: 'bun' | 'main' | 'sauce';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

// Расширяем тип TIngredient уникальным id, чтобы использовать в конструкторе бургера
export type TConstructorIngredient = TIngredient & {
  id: string;
};

// Типы для заказов

export type TOrder = {
  _id: string;
  ingredients: string[];
  status: 'created' | 'pending' | 'done';
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
};

export type TOrderResponse = {
  success: boolean;
  orders: TOrder[];
  order?: TOrder;
  total: number;
  totalToday: number;
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

// Типы для пользователя

export type TUser = {
  email: string;
  name: string;
  password?: string;
  accessToken?: string;
  refreshToken?: string;
};

// Типы для WebSocket-действий

export type TWsActions = {
  wsInit: string;
  wsClose: string;
  onOpen: string;
  onClose: string;
  onError: string;
  onMessage: string;
};

// Режимы табов (булки, соусы, начинки)

export type TTabMode = 'bun' | 'sauce' | 'main';

// Состояние ингредиентов в хранилище

export type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

// Стейт пользователя

export type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

// Для ответа от API

export type TErrorResponse = {
  message: string;
  name: string;
};
