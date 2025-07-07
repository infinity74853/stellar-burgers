describe('Stellar Burgers: Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('POST', 'api/orders', {
      success: true,
      order: { number: 12345 }
    }).as('createOrder');

    // Авторизация через куки
    cy.setCookie('accessToken', 'test-token');
    cy.visit('/');
  });

  it('Добавление ингредиентов в конструктор', () => {
    // Добавляем булку (верх)
    cy.contains('Краторная булка').trigger('dragstart');
    cy.get('[class^="constructor-element_pos_top"]').trigger('drop');

    // Добавляем начинку
    cy.contains('Филе Люминесцентного').trigger('dragstart');
    cy.get('[class^="burger-constructor_ingredients"]').trigger('drop');

    // Проверяем активность кнопки заказа
    cy.contains('Оформить заказ').should('not.be.disabled');
  });

  it('Создание заказа', () => {
    // Добавляем ингредиенты
    cy.contains('Краторная булка').trigger('dragstart');
    cy.get('[class^="constructor-element_pos_top"]').trigger('drop');
    cy.contains('Филе Люминесцентного').trigger('dragstart');
    cy.get('[class^="burger-constructor_ingredients"]').trigger('drop');

    // Оформляем заказ
    cy.contains('Оформить заказ').click();

    // Проверяем модальное окно
    cy.wait('@createOrder');
    cy.contains('идентификатор заказа').should('exist');
    cy.contains('12345').should('exist');

    // Закрываем модальное окно
    cy.get('[class^="modal_close"]').click();
    cy.contains('идентификатор заказа').should('not.exist');
  });
});
