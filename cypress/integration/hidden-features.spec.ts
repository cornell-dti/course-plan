/**
 * A test file containing a number of tests on features and bugs that are often forgotten about when testing PRs.
 * Can and should be expanded in the future.
 */

// Before running tests, delete Firestore data for the testing email (so the initial onboarding and walkthrough trigger)
// Then start on landing page, log in to firebase, and visits the dashboard
// Delete and log in occurs with TEST_UID and test email of the courseplan testing account using functions from the cypress-firebase package
before('Delete test user data, then visit site and log in', () => {
  // log the user in
  cy.visit('localhost:8080/login');
  cy.login(Cypress.env('TEST_UID'));

  const TEST_EMAIL = Cypress.env('TEST_EMAIL');

  // delete test user's necessary collections to treat them as a new user
  cy.callFirestore('delete', `user-onboarding-data/${TEST_EMAIL}`);
  cy.callFirestore('delete', `user-semesters/${TEST_EMAIL}`);

  // visit the site
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

  // confirm that onboarding cannot be clicked outsideto close when creating a new user
  cy.get('[data-cyId=onboarding]').clickOutside();
  cy.get('[data-cyId=onboarding]').should('be.visible');

  // set Entrance semester to 2018 (default Fall)
  cy.get('[data-cyId=onboarding-dropdown]').eq(1).click();
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

  // set Graduation semester to Summer 2022
  cy.get('[data-cyId=onboarding-dropdown]').eq(2).click();
  cy.get('[data-cyId=onboarding-dropdownItem]').each($el => {
    cy.wrap($el)
      .invoke('text')
      .then(text => {
        if (text.includes('Summer')) {
          cy.wrap($el).click();
        }
      });
  });
  cy.get('[data-cyId=onboarding-nextButton]').should('be.disabled');
  cy.get('[data-cyId=onboarding-error]').scrollIntoView().should('be.visible');

  cy.get('[data-cyId=onboarding-dropdown]').eq(3).click();
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
  cy.get('[data-cyId=onboarding-dropdown]').eq(4).click();
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

  // confirm Fall 2018, Summer 2022, and engineering are selected on the review screen
  cy.get('[data-cyId=onboarding-entranceYear]').contains('2018');
  cy.get('[data-cyId=onboarding-entranceSeason]').contains('Fall');
  cy.get('[data-cyId=onboarding-gradYear]').contains('2022');
  cy.get('[data-cyId=onboarding-gradSeason]').contains('Summer');
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

// Test to confirm that only one "+New Semester" button shows up at once
// Due to front-end styling issues, there are two different buttons in different components
// Only one should be visible at a time (from semesterView if there are 0 semesters, from semester otherwise)
it('Test that only one semester button shows', () => {
  // Delete each existing semester
  const semesterMenus = '[data-cyId=semesterMenu]';
  if (Cypress.$(semesterMenus).length > 0) {
    // before deleting, confirm the semester button is the only version to exist
    cy.get('[data-cyId=semester-addSemesterButton]').should('be.visible');
    cy.get('[data-cyId=semesterView-addSemesterButton]').should('not.exist');

    cy.get(semesterMenus).each($el => {
      cy.wrap($el).click();
      cy.get('[data-cyId=semesterMenu-delete]').click();
      cy.get('[data-cyId=modal-button]').click();
    });
  }

  // After all semesters deleted, confirm only the semesterView version is visible
  cy.get('[data-cyId=semester-addSemesterButton]').should('not.exist');
  cy.get('[data-cyId=semesterView-addSemesterButton]').should('be.visible');

  // Add a semester back
  cy.get('[data-cyId=semesterView-addSemesterButton]').click();

  // click Fall
  cy.get('[data-cyId=newSemester-seasonWrapper]').click();
  cy.get('[data-cyId=newSemester-seasonItem]').first().click();

  // click oldest year
  cy.get('[data-cyId=newSemester-yearWrapper]').click();
  cy.get('[data-cyId=newSemester-yearItem]').first().click();

  // add semester
  cy.get('[data-cyId=modal-button]').click();

  // Confirm only the semester version exists
  cy.get('[data-cyId=semester-addSemesterButton]').should('be.visible');
  cy.get('[data-cyId=semesterView-addSemesterButton]').should('not.exist');
});

// Test to confirm that CUReviews data is being loaded in for a sample course
// In the past, CUReviews data has stopped coming in and not been noticed since it is hidden in the bottom bar
it('Confirm CUReviews data exists', () => {
  // open add modal and try to add CS 1110
  cy.get('[data-cyId=semester-addCourse]').click();
  cy.get('[data-cyId=newCourse-dropdown]').type('CS 1110');
  cy.get('[data-cyId=newCourse-searchResult]').first().click();
  cy.get('[data-cyId=modal-button]').click();

  // open the bottom bar
  cy.get('[data-cyId=semester-course]').click();

  // confirm each CUReviews data value is not "N/A" - which occurs if data fetched incorrectly
  cy.get('[data-cyId="CUReviews-overall')
    .invoke('text')
    .should(text => {
      expect(text).not.to.eq('N/A');
    });

  cy.get('[data-cyId="CUReviews-difficulty')
    .invoke('text')
    .should(text => {
      expect(text).not.to.eq('N/A');
    });

  cy.get('[data-cyId="CUReviews-workload')
    .invoke('text')
    .should(text => {
      expect(text).not.to.eq('N/A');
    });
});

// Test to confirm that teleport modals can be clicked outside of to close them
it('Click outside teleport modals', () => {
  cy.get('[data-cyId=semester-addCourse]').click();
  cy.get('[data-cyId=teleportModal]').should('be.visible');
  cy.get('[data-cyId=teleportModal]').clickOutside();
  cy.get('[data-cyId=teleportModal]').should('not.exist');
});

// Test to confirm that onboarding can be clicked outside (when editing)
it('Click outside onboarding modal', () => {
  cy.get('[data-cyId=editProfile]').click();
  cy.get('[data-cyId=onboarding]').should('be.visible');
  cy.get('[data-cyId=onboarding]').clickOutside();
  cy.get('[data-cyId=onboarding]').should('not.exist');
});

// Test to confirm the mobile menu shows up in front of the dashboard
// Also confirm onboarding and requirements can still be interacted with on mobile
it('Use mobile navbar', () => {
  cy.viewport('samsung-s10'); // Set viewport to the dimensions of a Samsung S10

  // confirm menu works
  cy.get('[data-cyId=navbar-menuButton]').click();
  cy.get('[data-cyId=navbar-menu]').should('be.visible');

  // confirm onboarding works
  cy.get('[data-cyId=navbar-editProfile]').click();
  cy.get('[data-cyId=onboarding-cancel]').click();

  // confirm requirements works
  cy.get('[data-cyId=navbar-menuButton]').click();
  cy.get('[data-cyId=navbar-viewRequirements]').click();
  cy.get('[data-cyId=requirements-viewMore]').click();
});

// Test to make sure giveaway modal successfully exits
it('Exit Giveaway Modal', () => {
  cy.get('[data-cyId=giveaway-exit]').click();
});
