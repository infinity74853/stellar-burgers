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

  it('Добавляет булку и начинку в конструктор', () => {
    // Булка
    cy.get('h3')
      .contains('Булки')
      .parent()
      .find('ul > li')
      .contains('Флюоресцентная булка R2-D3');

    // Начинка
    cy.get('h3')
      .contains('Начинки')
      .parent()
      .find('ul > li')
      .contains('Филе Люминесцентного тетраодонтимформа');
  });

  it('Открывает и закрывает модальное окно ингредиента', () => {
    cy.get('h3')
      .contains('Булки')
      .parent()
      .find('ul > li')
      .contains('Флюоресцентная булка R2-D3')
      .click();

    cy.contains('Детали ингредиента').should('exist');
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
});

describe('Тестирование без авторизации', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Перенаправляет на страницу входа при попытке оформить заказ без авторизации', () => {
    // Кликаем оформить заказ
    cy.contains('button', 'Оформить заказ').click();
    cy.visit('/login');
  });
});
