/**
 * A test file containing a number of tests on features and bugs that are often forgotten about when testing PRs.
 * Can and should be expanded in the future.
 */

// Before running tests, delete Firestore data for the testing email (so the initial onboarding and walkthrough trigger)
// Then start on landing page, log in to firebase, and visits the dashboard
// Delete and log in occurs with TEST_UID and test email of the courseplan testing account using functions from the cypress-firebase package
before('Delete test user data, then visit site and log in', () => {
  // delete user-onboarding-data for TEST_EMAIL
  // note that this delete will break if the collection is ever renamed
  const TEST_EMAIL = 'courseplan.cornelldti.test@gmail.com';
  cy.callFirestore('delete', `user-onboarding-data/${TEST_EMAIL}`);
  cy.callFirestore('delete', `user-semesters/${TEST_EMAIL}`);

  cy.visit('localhost:8080/login');
  cy.login(Cypress.env('TEST_UID'));
  cy.visit('localhost:8080');
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(5000); // ensure the page has time to load
});

// Test to go through the onboarding flow
// Confirm that the next button cannot be clicked until all required fields have been filled out (as the user has no previous data)
it('Onboard a new user with all required fields', () => {
  // confirm the next button is disabled and the error text is visible until all required fields filled out
  cy.get('[data-cyId=onboarding-nextButton]').should('be.disabled');
  cy.get('[data-cyId=onboarding-error]').scrollIntoView().should('be.visible');

  // set Graduation year to 2018
  cy.get('[data-cyId=onboarding-dropdown]').eq(0).click();
  cy.get('[data-cyId=onboarding-dropdownItem]').each($el => {
    cy.wrap($el)
      .invoke('text')
      .then(text => {
        if (text.includes('2018')) {
          cy.wrap($el).click();
        }
      });
  });
  cy.get('[data-cyId=onboarding-nextButton]').should('be.disabled');
  cy.get('[data-cyId=onboarding-error]').scrollIntoView().should('be.visible');

  // set Graduation year to 2022
  cy.get('[data-cyId=onboarding-dropdown]').eq(1).click();
  cy.get('[data-cyId=onboarding-dropdownItem]').each($el => {
    cy.wrap($el)
      .invoke('text')
      .then(text => {
        if (text.includes('2022')) {
          cy.wrap($el).click();
        }
      });
  });
  cy.get('[data-cyId=onboarding-nextButton]').should('be.disabled');
  cy.get('[data-cyId=onboarding-error]').scrollIntoView().should('be.visible');

  // set to Engineering college
  cy.get('[data-cyId=onboarding-dropdown]').eq(2).click();
  cy.get('[data-cyId=onboarding-dropdownItem]').each($el => {
    cy.wrap($el)
      .invoke('text')
      .then(text => {
        if (text.includes('Engineering')) {
          cy.wrap($el).click();
        }
      });
  });

  // next button can be clicked and error not visible now that every field has been selected
  cy.get('[data-cyId=onboarding-nextButton]').click();
  cy.get('[data-cyId=onboarding-error]').should('not.exist');
  cy.get('[data-cyId=onboarding-nextButton]').click();

  // confirm 2018, 2022, and engineering are selected on the review screen
  cy.get('[data-cyId=onboarding-entranceYear]').contains('2018');
  cy.get('[data-cyId=onboarding-gradYear]').contains('2022');
  cy.get('[data-cyId=onboarding-college]').contains('Engineering');
  cy.get('[data-cyId=onboarding-finishButton]').click();
});

// Test to confirm that the new user walkthrough works as expected
// Click through the initial explanation, then the 4 following steps, and finally the finishing page
it('Click through the walkthrough tour', () => {
  cy.get('[data-cyId=tour]').should('be.visible');
  cy.get('[data-cyId=tour-startButton]').click();

  // click through each step of the walkthrough, and confirm the tooltips are visible
  // note that the introjs DOM elements come from the package, so cyID attributes cannot be used
  cy.get('.tourStep1').should('be.visible');
  cy.get('.introjs-nextbutton').click();

  cy.get('.tourStep2').should('be.visible');
  cy.get('.introjs-nextbutton').click();

  cy.get('.tourStep3').should('be.visible');
  cy.get('.introjs-nextbutton').click();

  cy.get('.tourStep4').should('be.visible');
  cy.get('.introjs-nextbutton').click();

  // confirm the final page is visible and the tour can be finished
  cy.get('[data-cyId=tour]').should('be.visible');
  cy.get('[data-cyId=tour-startButton]').click();
});
