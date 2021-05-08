// A test file containing a number of basic tests to confirm general frontend functionality works
// Can and should be expanded on in more files to test more specific functionality and ensure future bugs are caught earlier

// Before running tests, starts on landing page, logs in with firebase oauth, then visits the dashboard
before('Visit site logged in', () => {
  cy.visit('localhost:8080/login');
  cy.login(Cypress.env('TEST_UID'));
  cy.visit('localhost:8080');
  cy.wait(5000); // ensure the page has time to load
});

// Delete existing semesters to ensure existing data does not mess with tests
it('Delete all existing semesters, if any exist', () => {
  const semesterMenus = '[data-cyId=semesterMenu]';
  if (Cypress.$(semesterMenus).length > 0) {
    cy.get(semesterMenus).each($el => {
      cy.wrap($el).click();
      cy.get('[data-cyId=semesterMenu-delete]').click();
      cy.get('[data-cyId=modal-button]').click();
    });
  }
});

// Confirm that a semester can be added to the plan
it('Add a semester (Fall 2015)', () => {
  // open the new semester modal
  cy.get('[data-cyId=semesterView-addSemesterButton]').click();

  // click Fall
  cy.get('[data-cyId=newSemester-seasonWrapper]').click();
  cy.get('[data-cyId=newSemester-seasonItem]').first().click();

  // click 2015
  cy.get('[data-cyId=newSemester-yearWrapper]').click();
  cy.get('[data-cyId=newSemester-yearItem]').first().click();

  // add semester
  cy.get('[data-cyId=modal-button]').click();

  // confirm the oldest semester is the newly added one
  cy.get('[data-cyId=semesterName]').last().contains('Fall 2015');
});

// Confirm that duplicate semesters cannot be added
it('Fail to add a duplicate semester (Fall 2015)', () => {
  // because a semester exists, get semester-addSemesterButton instead of semesterVIew-addSemesterButton
  cy.get('[data-cyId=semester-addSemesterButton]').click();

  // click fall
  cy.get('[data-cyId=newSemester-seasonWrapper]').first().click();
  cy.get('[data-cyId=newSemester-seasonItem]').first().click();

  // click 2015
  cy.get('[data-cyId=newSemester-yearWrapper]').first().click();
  cy.get('[data-cyId=newSemester-yearItem]').first().click();

  // confirm button is disabled
  cy.get('[data-cyId=modal-button]').should('be.disabled');

  // exit the modal
  cy.get('[data-cyId=modal-exit]').click();
});

// Confirm that the newly added semester can be edited
it('Edit a semester (Fall 2015 -> Spring 2016)', () => {
  // open the edit semester menu
  cy.get('[data-cyId=semesterMenu]').first().click();
  cy.get('[data-cyId=semesterMenu-edit]').click();

  // click spring
  cy.get('[data-cyId=newSemester-seasonWrapper]').last().click();
  cy.get('[data-cyId=newSemester-seasonItem]').eq(1).click();

  // click 2016
  cy.get('[data-cyId=newSemester-yearWrapper]').last().click();
  cy.get('[data-cyId=newSemester-yearItem]').eq(1).click();

  // finish editing and confirm it has been updated
  cy.get('[data-cyId=modal-button]').click();
  cy.get('[data-cyId=semesterName]').last().contains('Spring 2016');
});

// Test that you can change entrance year, grad year, colleges and majors. A later requirements test is dependent on these choices
it('Switch to engineering college and cs major in class of 2022', () => {
  cy.get('[data-cyId=editProfile]').click();

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

  // set to CS major
  cy.get('[data-cyId=onboarding-dropdown]').eq(3).click();
  cy.get('[data-cyId=onboarding-dropdownItem]').each($el => {
    cy.wrap($el)
      .invoke('text')
      .then(text => {
        if (text.includes('Computer Science')) {
          cy.wrap($el).click();
        }
      });
  });

  // click through the rest of onboarding
  cy.get('[data-cyId=onboarding-nextButton]').click();
  cy.get('[data-cyId=onboarding-nextButton]').click();

  // confirm 2018, 2022, engineering, and computer science are selected on the review screen
  cy.get('[data-cyId=onboarding-entranceYear]').contains('2018');
  cy.get('[data-cyId=onboarding-gradYear]').contains('2022');
  cy.get('[data-cyId=onboarding-college]').contains('Engineering');
  cy.get('[data-cyId=onboarding-major]').contains('Computer Science');
  cy.get('[data-cyId=onboarding-finishButton]').click();

  // confirm engineering and computer science are selected on the requirements menu
  cy.get('[data-cyId=majorTitle]').contains('Computer Science');
  cy.get('[data-cyId=collegeTitle]').contains('(Engineering)');
});

// This test not only adds CS 1110, but confirms the new add modal has the correct requirements,
// the course was properly added, and that it was assigned to the correct requirement
it('Add a course with the new add modal (CS 1110)', () => {
  // open add modal and try to add CS 1110
  cy.get('[data-cyId=semester-addCourse]').click();
  cy.get('[data-cyId=newCourse-dropdown]').type('CS 1110');
  cy.get('[data-cyId=newCourse-searchResult]').first().click();

  // confirm that the results of the add modal are expected
  cy.get('[data-cyId=newCourse-selectedCourse]').contains(
    'CS 1110: Introduction to Computing Using Python'
  );
  cy.get('[data-cyId=newCourse-requirements]').contains('Introductory Programming');

  // click to edit requirements
  cy.get('[data-cyId=newCourse-link]').click();
  cy.get('[data-cyId=newCourse-requirementsDropdown]').click();

  // confirm we have the correct options by matching each dropdown element
  let reqOptions = ['Advisor-Approved Electives', 'Major-approved Elective(s)', 'None'];
  cy.get('[data-cyId=newCourse-reqOption]').each(($el, i) => {
    cy.wrap($el).contains(reqOptions[i]);
  });

  // keep it assigned to the default introductory programming requirement
  cy.get('[data-cyId=newCourse-requirementsDropdown]').click();
  cy.get('[data-cyId=modal-button]').click();
  cy.get('[data-cyId=modal-button]').click();

  // confirm the only course in plan is CS 1110
  cy.get('[data-cyId=courseCode]').contains('CS 1110');

  // confirm that the only subreq completed has CS 1110 assigned to it (Computing)
  cy.get('[data-cyId=requirements-viewMore]').first().click();
  cy.get('[data-cyId=requirements-showCompleted]').click();
  cy.get('[data-cyId=requirements-displayToggle]').last().click();
  cy.get('[data-cyId=reqcourse-code]').first().contains('CS 1110');
});
