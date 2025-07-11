import ingredientsReducer, {
  fetchIngredients,
  fetchIngredientById,
  setCurrentIngredient,
  clearCurrentIngredient,
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError,
  selectIngredientsLoaded,
  selectCurrentIngredient
} from './ingredientsSlice';
import { RootState } from '../store';
import { TIngredient } from '@utils-types';

// Создаём копию initialState из слайса (без его изменения)
const initialState = {
  ingredients: [],
  isLoading: false,
  error: null,
  loaded: false,
  currentIngredient: null
};

// Пример мокового ингредиента
const mockIngredient: TIngredient = {
  _id: '1',
  name: 'Булка',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 40,
  price: 100,
  image: 'image-url',
  image_mobile: 'mobile-image-url',
  image_large: 'large-image-url'
};

const mockIngredients: TIngredient[] = [
  mockIngredient,
  {
    ...mockIngredient,
    _id: '2',
    name: 'Соус',
    type: 'sauce'
  }
];

describe('Тесты для ingredientsSlice', () => {
  describe('Начальное состояние', () => {
    it('должно соответствовать ожидаемой структуре', () => {
      const state = ingredientsReducer(undefined, { type: '' });
      expect(state).toEqual(initialState);
    });

    it('совпадает со снапшотом', () => {
      expect(ingredientsReducer(undefined, { type: '' })).toMatchSnapshot();
    });
  });

  describe('Синхронные экшены', () => {
    it('setCurrentIngredient устанавливает ингредиент', () => {
      const state = ingredientsReducer(
        initialState,
        setCurrentIngredient(mockIngredient)
      );
      expect(state.currentIngredient).toEqual(mockIngredient);
      expect(state).toMatchSnapshot();
    });

    it('clearCurrentIngredient очищает текущий ингредиент', () => {
      const stateWithIngredient = {
        ...initialState,
        currentIngredient: mockIngredient
      };
      const state = ingredientsReducer(
        stateWithIngredient,
        clearCurrentIngredient()
      );
      expect(state.currentIngredient).toBeNull();
      expect(state).toMatchSnapshot();
    });
  });

  describe('Асинхронные экшены', () => {
    it('fetchIngredients.pending устанавливает флаг загрузки', () => {
      const state = ingredientsReducer(initialState, {
        type: fetchIngredients.pending.type
      });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state).toMatchSnapshot();
    });

    it('fetchIngredients.fulfilled сохраняет ингредиенты', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(initialState, action);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.isLoading).toBe(false);
      expect(state.loaded).toBe(true);
      expect(state).toMatchSnapshot();
    });

    it('fetchIngredients.rejected сохраняет ошибку', () => {
      const error = 'Ошибка загрузки';
      const action = { type: fetchIngredients.rejected.type, payload: error };
      const state = ingredientsReducer(initialState, action);
      expect(state.error).toBe(error);
      expect(state.isLoading).toBe(false);
      expect(state).toMatchSnapshot();
    });
  });

  describe('Селекторы', () => {
    const testState: RootState = {
      ingredients: {
        ...initialState,
        ingredients: mockIngredients,
        currentIngredient: mockIngredient
      },
      // Заглушки для других слайсов
      burgerConstructor: {} as any,
      feed: {} as any,
      orderHistory: {} as any,
      user: {} as any
    };

    it('selectIngredients возвращает ингредиенты', () => {
      expect(selectIngredients(testState)).toEqual(mockIngredients);
    });

    it('selectCurrentIngredient возвращает текущий ингредиент', () => {
      expect(selectCurrentIngredient(testState)).toEqual(mockIngredient);
    });

    it('комбинация селекторов совпадает со снапшотом', () => {
      expect({
        ingredients: selectIngredients(testState),
        current: selectCurrentIngredient(testState),
        loading: selectIngredientsLoading(testState),
        error: selectIngredientsError(testState),
        loaded: selectIngredientsLoaded(testState)
      }).toMatchSnapshot();
    });
  });
});
