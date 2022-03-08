/**
 * A test file that tests accessibility on all parts of CoursePlan
 * Can and should be expanded in the future.
 */

// Before running tests, start on landing page, login to firebase, and inject accessibility scripts
// Log in occurs with TEST_UID of the courseplan testing account using a function from the cypress-firebase package
before('Visit landing page logged in', () => {
  cy.visit('localhost:8080/login');
  cy.login(Cypress.env('TEST_UID'));

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(2000); // ensure the page has time to load

  cy.injectAxe(); // inject the axe-core library to check accessibility
});

it('Check landing page accessibility', () => {
  cy.checkA11y();
});

it('Visit dashboard and check dashboard accessibility', () => {
  cy.visit('localhost:8080');

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(5000); // ensure the page has time to load

  cy.injectAxe(); // re-inject the library due to switching page

  cy.checkA11y();
});

// Check the accessibility of each page of Onboarding
// Note that the selector in checkA11y ensures violations behind the modal are not caught
it('Check accessibility of onboarding modal pages', () => {
  cy.get('[data-cyId=editProfile]').click();
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
  cy.checkA11y('[data-cyId=onboarding]'); // only check accessibility within the onboarding modal

  cy.get('[data-cyId=onboarding-nextButton]').click();
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
  cy.checkA11y('[data-cyId=onboarding]');

  cy.get('[data-cyId=onboarding-nextButton]').click();
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
  cy.checkA11y('[data-cyId=onboarding]');

  cy.get('[data-cyId=onboarding-finishButton]').click();
});
