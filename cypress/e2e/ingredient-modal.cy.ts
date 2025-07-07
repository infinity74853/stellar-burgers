describe('Stellar Burgers: Модальное окно ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
  });

  it('Открытие и закрытие модального окна', () => {
    // Открываем модальное окно
    cy.contains('Краторная булка').click();

    // Проверяем содержимое
    cy.contains('Детали ингредиента').should('exist');
    cy.contains('Краторная булка N-200i').should('exist');

    // Закрываем через крестик
    cy.get('[class^="modal_close"]').click();
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('Закрытие через оверлей и ESC', () => {
    cy.contains('Краторная булка').click();

    // Закрытие через оверлей
    cy.get('[class^="modal_overlay"]').click({ force: true });
    cy.contains('Детали ингредиента').should('not.exist');

    // Закрытие через ESC
    cy.contains('Краторная булка').click();
    cy.get('body').type('{esc}');
    cy.contains('Детали ингредиента').should('not.exist');
  });
});
