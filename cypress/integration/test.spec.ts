// A test file containing a number of basic tests to confirm general frontend functionality works
// Can and should be expanded on in more files to test more specific functionality and ensure future bugs are caught earlier

it('Visit site logged in', () => {
  cy.visit('localhost:8080');
});

// Delete existing semesters to ensure existing data does not mess with tests
// Note: will fail if the user testing has no semesters, but the other tests will continue as expected
it('Delete all existing semesters', () => {
  cy.get('.semester-dotRow').each($el => {
    cy.wrap($el).click();
    cy.get('.semesterMenu-delete').click();
    cy.get('.deleteSemesterModal-button--delete').first().click();
  });
});

// Confirm that a semester can be added to the plan
it('Add a semester (Fall 2011)', () => {
  // open the new semester modal
  cy.get('.semesterView-addSemesterButton').click();
  cy.get('.semester-modal').should('have.class', 'modal--block');

  // click fall
  cy.get('.season-wrapper').first().click();
  cy.get('.newSemester-dropdown-content-item').first().click();

  // click 2011
  cy.get('.year-wrapper').first().click();
  cy.get('.newSemester-dropdown-content-item').first().click();

  // add semester
  cy.get('.modal-button--add').first().click();

  // confirm the oldest semester is the newly added one
  cy.get('.semester-name').last().contains('Fall 2011');
});

// Confirm that duplicate semesters cannot be added
it('Fail to add a duplicate semester (Fall 2011)', () => {
  // because a semester exists, get semester-addSemesterButton instead of semesterVIew-addSemesterButton
  cy.get('.semester-addSemesterButton').click();
  cy.get('.semester-modal').should('have.class', 'modal--block');

  // click fall
  cy.get('.season-wrapper').first().click();
  cy.get('.newSemester-dropdown-content-item').first().click();

  // click 2011
  cy.get('.year-wrapper').first().click();
  cy.get('.newSemester-dropdown-content-item').first().click();

  // confirm button is disabled
  cy.get('.modal-button--add').should('have.class', 'modal-button--disabled');

  // exit the modal
  cy.get('.modal-exit').first().click();
});

// Confirm that the newly added semester can be edited
it('Edit a semester (Fall 2011 -> Spring 2012)', () => {
  // open the edit semester menu
  cy.get('.semester-dotRow').first().click();
  cy.get('.semesterMenu-edit').click();
  cy.get('.editSemesterModal').should('have.class', 'modal--block');

  // click spring
  cy.get('.season-wrapper').last().click();
  cy.get('.newSemester-dropdown-content-item').eq(1).click();

  // click 2012
  cy.get('.year-wrapper').last().click();
  cy.get('.newSemester-dropdown-content-item').eq(1).click();

  // finish editing and confirm it has been updated
  cy.get('.editSemesterModal-button-left').first().click();
  cy.get('.semester-name').last().contains('Spring 2012');
});

// Test that you can change colleges and majors. A later requirements test is dependent on these choices
it('Switch to engineering college and cs major', () => {
  cy.get('#profileIcon').click();

  // set to Engineering college
  cy.get('.onboarding-select').eq(0).click();
  cy.get('.onboarding-dropdown-content-item').each($el => {
    cy.wrap($el)
      .invoke('text')
      .then(text => {
        console.log(text);
        if (text.includes('Engineering')) {
          cy.wrap($el).click();
        }
      });
  });

  // set to CS major
  cy.get('.onboarding-select').eq(1).click();
  cy.get('.onboarding-dropdown-content-item').each($el => {
    cy.wrap($el)
      .invoke('text')
      .then(text => {
        console.log(text);
        if (text.includes('Computer Science')) {
          cy.wrap($el).click();
        }
      });
  });

  // click through the rest of onboarding
  cy.get('.onboarding-button').click();
  cy.get('.onboarding-button').click();

  // confirm engineering and computer science are selected on the review screen
  cy.get('#onboarding-college').contains('Engineering');
  cy.get('#onboarding-major').contains('Computer Science');
  cy.get('.onboarding-button').click();

  // Skips the walkthrough
  // TODO: get rid of this after the walkthrough PR is merged in and it does not show up at this point anymore
  cy.get('.intropage > .content > a').click();

  // confirm engineering and computer science are selected on the requirements menu
  cy.get('.major-title-top').contains('Computer Science');
  cy.get('.major-title-bottom').contains('(Engineering)');
});

// This test not only adds CS 1110, but confirms the new add modal has the correct requirements,
// the course was properly added, and that it was assigned to the correct requirement
it('Add a course with the new add modal (CS 1110)', () => {
  // open add modal and try to add CS 1110
  cy.get('.semester-addWrapper').click();
  cy.get('.newCourse-dropdown').type('CS 1110');
  cy.get('.search-result').first().click();

  // confirm that the results of the add modal are expected
  cy.get('.selected-course').contains('CS 1110: Introduction to Computing Using Python');
  cy.get('.newCourse-requirements').contains('Introductory Programming');

  // click to edit requirements
  cy.get('.newCourse-link').click();
  cy.get('.dropdown').click();

  // confirm we have the correct options by matching each dropdown element
  let reqOptions = [
    'Computing',
    'Advisor-Approved Electives',
    'Technical Electives',
    'External Specialization',
    'Major-approved Elective(s)',
    'None',
  ];
  cy.get('.dropdown-content > li > a').each(($el, i) => {
    cy.wrap($el).contains(reqOptions[i]);
  });

  // keep it assigned to the default introductory programming requirement
  cy.get('.dropdown').click();
  cy.get('.modal-button--add').last().click();
  cy.get('.modal-button--add').last().click();

  // confirm the only course in plan is CS 1110
  cy.get('.course-top').contains('CS 1110');

  // confirm that the only subreq completed has CS 1110 assigned to it (Computing)
  cy.get('.view-more-dropdown').first().click();
  cy.get('.toggle').click();
  cy.get('.subreq-name').last().click();
  cy.get('.reqcourse-code').first().contains('CS 1110');
});
