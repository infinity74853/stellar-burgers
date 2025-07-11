import burgerConstructorSlice, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  TConstructorIngredient
} from './burgerConstructorSlice';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const mockIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

describe('Тесты для слайса burgerConstructorSlice', () => {
  it('должен возвращать начальное состояние', () => {
    expect(burgerConstructorSlice(undefined, { type: '' })).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('Тест для добавления булки', () => {
    const previousState = { bun: null, ingredients: [] };
    expect(burgerConstructorSlice(previousState, addBun(mockBun))).toEqual({
      bun: mockBun,
      ingredients: []
    });
  });

  it('Тест для добавления ингредиента', () => {
    const previousState = { bun: null, ingredients: [] };
    const action = addIngredient(mockIngredient);
    const result = burgerConstructorSlice(previousState, action);

    // Проверяем, что ингредиент добавлен и у него есть уникальный id
    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0]).toEqual({
      ...mockIngredient,
      id: expect.any(String)
    });
  });

  it('Тест для удаления ингредиента', () => {
    const ingredientWithId: TConstructorIngredient = {
      ...mockIngredient,
      id: 'test-id'
    };
    const previousState = {
      bun: null,
      ingredients: [ingredientWithId]
    };

    // Удаляем ингредиент по индексу 0
    expect(
      burgerConstructorSlice(previousState, removeIngredient('0'))
    ).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('Тест для перемещения ингредиента', () => {
    const firstIngredient: TConstructorIngredient = {
      ...mockIngredient,
      id: '1'
    };
    const secondIngredient: TConstructorIngredient = {
      ...mockIngredient,
      id: '2'
    };
    const previousState = {
      bun: null,
      ingredients: [firstIngredient, secondIngredient]
    };

    // Меняем местами ингредиенты (from: 0, to: 1)
    const result = burgerConstructorSlice(
      previousState,
      moveIngredient({ from: 0, to: 1 })
    );

    expect(result.ingredients).toEqual([secondIngredient, firstIngredient]);
  });

  it('Тест для очистки конструктора', () => {
    const previousState = {
      bun: mockBun,
      ingredients: [{ ...mockIngredient, id: 'test-id' }]
    };
    expect(burgerConstructorSlice(previousState, clearConstructor())).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
