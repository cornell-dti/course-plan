it('Visit site logged in', () => {
  cy.visit('localhost:8080');
  // cy.dashboard
});

// Delete existing semesters to ensure existing data does not mess with tests
// Note: will fail if there are no semesters, but the other tests will continue as expected
it('Delete all existing semesters', () => {
  cy.get('.semester-dotRow').each($el => {
    cy.wrap($el).click();
    cy.get('.semesterMenu-delete').click();
    cy.get('.deleteSemesterModal-button--delete').first().click();
  });
});

// Add a Fall 2011 semester
it('Add a semester (Fall 2011)', () => {
  cy.get('.semesterView-addSemesterButton').click();

  cy.get('.semester-modal').should('have.class', 'modal--block');

  // Click fall
  cy.get('.season-wrapper').first().click();
  cy.get('.newSemester-dropdown-content-item').first().click();

  // Click 2011
  cy.get('.year-wrapper').first().click();
  cy.get('.newSemester-dropdown-content-item').first().click();

  // add semester
  cy.get('.modal-button--add').first().click();

  // confirm the oldest semester is the newly added one
  cy.get('.semester-name').last().contains('Fall 2011');
});

// describe('Login', () => {
//   it('Login through Google', () => {
//     const username = Cypress.env('googleSocialLoginUsername');
//     const password = Cypress.env('googleSocialLoginPassword');
//     const loginUrl = Cypress.env('loginUrl');
//     const cookieName = Cypress.env('cookieName');
//     const socialLoginOptions = {
//       username: username,
//       password: password,
//       loginUrl: loginUrl,
//       headless: true,
//       logs: false,
//       loginSelector: '[href="/auth/auth0/google-oauth2"]',
//       postLoginSelector: '.account-panel',
//     };

//     return cy.task('GoogleSocialLogin', socialLoginOptions).then(({ cookies }) => {
//       cy.clearCookies();

//       const cookie = cookies.filter(cookie => cookie.name === cookieName).pop();
//       if (cookie) {
//         cy.setCookie(cookie.name, cookie.value, {
//           domain: cookie.domain,
//           expiry: cookie.expires,
//           httpOnly: cookie.httpOnly,
//           path: cookie.path,
//           secure: cookie.secure,
//         });

//         Cypress.Cookies.defaults({
//           preserve: cookieName,
//         });
//       }
//     });
//   });
// });
