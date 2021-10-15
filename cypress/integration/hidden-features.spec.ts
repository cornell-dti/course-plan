/**
 * A test file containing a number of tests on features and bugs that are often forgotten about when testing PRs.
 * Can and should be expanded in the future.
 */

before('Log in to CoursePlan', () => {
  cy.visit('localhost:8080/login');
  cy.login(Cypress.env('TEST_UID'));
  cy.visit('localhost:8080');
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(5000); // ensure the page has time to load
});
