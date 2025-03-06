/**
 * A test file that tests accessibility on all views of CoursePlan
 * Can and should be expanded in the future.
 * TODO @willespencer remove the skipFailures flag set to true in checkA11y once accessibility issues have been resolved
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
  cy.checkA11y(null, null, null, true);
});

it('Visit dashboard and check semesterview accessibility', () => {
  cy.visit('localhost:8080');

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(5000); // ensure the page has time to load

  cy.injectAxe(); // re-inject the library due to switching page

  cy.checkA11y('[data-cyId=semesterView]', null, null, true); // only check accessibility within the semesterView
});

it('Check navbar accessibility', () => {
  cy.checkA11y('[data-cyId=navbar]', null, null, true); // only check accessibility within the navbar
});

// Test to confirm that the new user walkthrough works as expected
// Click through the initial explanation, then the 4 following steps, and finally the finishing page
it('Click through schedule generator tour', () => {
  cy.get('.introjs-nextbutton').click();
});

// Check the accessibility of the requirements sidebar with all toggles fully open
// Note that the selector in checkA11y ensures only the sidebar is inspected
it('Check accessibility of the requirements sidebar', () => {
  // Note that there must a completed requirement (i.e. swim test)
  cy.get('[data-cyId=semester-addCourse]').click();
  cy.get('[data-cyId=newCourse-dropdown]').type('PE 1100');
  cy.get('[data-cyId=newCourse-searchResult]').first().click();
  cy.get('[data-cyId=modal-button]').click();

  // open all dropdowns in the sidebar
  cy.get('[data-cyId=requirements-viewMore]').click({ multiple: true });
  cy.get('[data-cyId=requirements-showCompleted]').click({ multiple: true });
  cy.get('[data-cyId=requirements-displayToggle]').click({ multiple: true, force: true });

  cy.checkA11y('[data-cyId=reqsSidebar]');
});

it('Check accessibility of the bottom bar', () => {
  // Note that a course must be added in case the plan is empty to do so
  cy.get('[data-cyId=semester-addCourse]').click();
  cy.get('[data-cyId=newCourse-dropdown]').type('CS 1110');
  cy.get('[data-cyId=newCourse-searchResult]').first().click();
  cy.get('[data-cyId=modal-button]').click();

  // open the bottom bar
  cy.get('[data-cyId=semester-course]').eq(0).click();

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(5000);
  cy.checkA11y('[data-cyId=bottombar]', null, null, true); // only check accessibility within the bottom bar
});

// Check the accessibility of each page of Onboarding
// Note that the selector in checkA11y ensures violations behind the modal are not caught
it('Check accessibility of onboarding modal pages', () => {
  cy.get('[data-cyId=editProfile]').click();
  cy.checkA11y('[data-cyId=onboarding]', null, null, true); // only check accessibility within the onboarding modal

  cy.get('[data-cyId=onboarding-nextButton]').click();
  cy.checkA11y('[data-cyId=onboarding]', null, null, true);

  cy.get('[data-cyId=onboarding-nextButton]').click();
  cy.checkA11y('[data-cyId=onboarding]', null, null, true);

  cy.get('[data-cyId=onboarding-finishButton]').click();
});

it('Visit privacy policy and check accessibility', () => {
  cy.visit('localhost:8080/policy');

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(2000); // ensure the page has time to load

  cy.injectAxe(); // re-inject the library due to switching page

  cy.checkA11y(null, null, null, true);
});

it('Visit 404 page and check accessibility', () => {
  cy.visit('localhost:8080/404');

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(2000); // ensure the page has time to load

  cy.injectAxe(); // re-inject the library due to switching page

  cy.checkA11y(null, null, null, true);
});
