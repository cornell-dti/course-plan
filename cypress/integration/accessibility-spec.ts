/**
 * A test file that tests accessibility on all parts of CoursePlan
 * Can and should be expanded in the future.
 */

// Before running tests, starts on landing page, logs in to firebase, then visits the dashboard
// Log in occurs with TEST_UID of the courseplan testing account using a function from the cypress-firebase package
before('Visit site logged in', () => {
  cy.visit('localhost:8080/login');
  cy.login(Cypress.env('TEST_UID'));
  cy.visit('localhost:8080');
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(5000); // ensure the page has time to load
});

// Confirm that a semester can be added to the plan
it('Add a semester (Fall of oldest year)', () => {
  // open the new semester modal
  cy.get('[data-cyId=semesterView-addSemesterButton]').click();

  // click Fall
  cy.get('[data-cyId=newSemester-seasonWrapper]').click();
  cy.get('[data-cyId=newSemester-seasonItem]').first().click();

  // click oldest year
  cy.get('[data-cyId=newSemester-yearWrapper]').click();
  cy.get('[data-cyId=newSemester-yearItem]').first().click();

  // add semester
  cy.get('[data-cyId=modal-button]').click();
});
