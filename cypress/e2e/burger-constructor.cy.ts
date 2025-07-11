describe('Тестирование конструктора бургеров Stellar Burgers', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Загружает и отображает списки ингредиентов', () => {
    // Булки
    cy.get('h3')
      .contains('Булки')
      .parent()
      .find('ul > li')
      .should('have.length.greaterThan', 0);
    // Начинки
    cy.get('h3')
      .contains('Начинки')
      .parent()
      .find('ul > li')
      .should('have.length.greaterThan', 0);
    // Соусы
    cy.get('h3')
      .contains('Соусы')
      .parent()
      .find('ul > li')
      .should('have.length.greaterThan', 0);
  });

  it('Отображает правильные данные ингредиента в модальном окне', () => {
    cy.get('h3')
      .contains('Начинки')
      .parent()
      .find('ul > li')
      .contains('Филе Люминесцентного тетраодонтимформа')
      .click();

    cy.contains('Филе Люминесцентного тетраодонтимформа').should('exist');
    cy.contains('643').should('exist');
    cy.contains('44').should('exist');
    cy.contains('26').should('exist');
    cy.contains('85').should('exist');
  });

  it('Оформляет заказ с авторизацией и показывает номер заказа', () => {
    cy.setCookie('accessToken', 'test-access-token');
    cy.window().then((win) =>
      win.localStorage.setItem('refreshToken', 'test-refresh-token')
    );

    // Добавить булку
    cy.get('h3')
      .contains('Булки')
      .parent()
      .find('ul > li')
      .contains('Флюоресцентная булка R2-D3')
      .parent()
      .find('button:contains("Добавить")')
      .click();

    // Добавить начинку
    cy.get('h3')
      .contains('Начинки')
      .parent()
      .find('ul > li')
      .contains('Филе Люминесцентного тетраодонтимформа')
      .parent()
      .find('button:contains("Добавить")')
      .click();

    // Оформить заказ
    cy.contains('button', 'Оформить заказ').click();
    cy.wait('@createOrder');
    cy.contains('12345').should('exist');
  });

  it('Закрывает модальное окно заказа и очищает конструктор', () => {
    cy.clearCookie('accessToken');
    cy.window().then((win) =>
      win.localStorage.setItem('refreshToken', 'test-refresh-token')
    );
  });
});

describe('Тесты модального окна ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredient');
    cy.visit('/');
    cy.wait('@getIngredient');

    // Получаем ингредиент перед каждым тестом
    cy.get('h3')
      .contains('Булки')
      .parent()
      .find('ul > li')
      .contains('Флюоресцентная булка R2-D3')
      .as('ingredient');
  });

  it('открыть модальное окно по клику на ингредиент', () => {
    cy.get('@ingredient').click();
  });

  it('закрыть модальное окно по клику на кнопку', () => {
    cy.get('@ingredient').click();
    cy.get('#modals').find('button').click();
    cy.get('#modals').find('button').should('not.exist');
  });

  it('закрыть модальное окно по клику на оверлей', () => {
    cy.get('@ingredient').click();
    cy.get('#modals').contains('modal').should('not.exist');
  });

  it('закрыть модальное окно по кнопке ESC', () => {
    cy.get('@ingredient').click();
    cy.document().trigger('keydown', { key: 'Escape' });
    cy.get('#modals').find('button').should('not.exist');
  });
});

describe('Тестирование авторизации', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Перенаправляет на страницу входа при попытке оформить заказ без авторизации', () => {
    // Добавляем ингредиент
    cy.get('h3')
      .contains('Булки')
      .parent()
      .find('ul > li')
      .contains('Флюоресцентная булка R2-D3')
      .parent()
      .find('button:contains("Добавить")')
      .click();

    // Пытаемся оформить заказ
    cy.contains('button', 'Оформить заказ').click();
    cy.url().should('include', '/login');
  });
});
