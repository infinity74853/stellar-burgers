describe('Stellar Burgers: Авторизация', () => {
  const mockUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  beforeEach(() => {
    cy.intercept('POST', 'api/auth/register', {
      user: mockUser,
      accessToken: 'Bearer test-token',
      refreshToken: 'test-refresh-token'
    }).as('register');

    cy.intercept('POST', 'api/auth/login', {
      user: mockUser,
      accessToken: 'Bearer test-token',
      refreshToken: 'test-refresh-token'
    }).as('login');

    cy.intercept('POST', 'api/auth/logout', { success: true }).as('logout');
  });

  it('Регистрация пользователя', () => {
    cy.visit('/register');

    // Заполняем форму регистрации
    cy.get('form').within(() => {
      cy.get('input[type="text"]').type('Test User');
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('password');
      cy.contains('button', 'Зарегистрироваться').click();
    });

    cy.wait('@register');
    cy.url().should('eq', 'http://localhost:3000/');
    cy.contains('Test User').should('exist');
  });

  it('Вход и выход из системы', () => {
    cy.visit('/login');

    // Заполняем форму входа
    cy.get('form').within(() => {
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('password');
      cy.contains('button', 'Войти').click();
    });

    cy.wait('@login');
    cy.contains('Test User').should('exist');

    // Выход
    cy.contains('Выход').click();
    cy.wait('@logout');
    cy.contains('Войти').should('exist');
  });
});
