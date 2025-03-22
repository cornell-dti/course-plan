/**
 * A test file containing a number of basic tests to confirm general frontend functionality works
 * Can and should be expanded on in more files to test more specific functionality and ensure future bugs are caught earlier
 */

import { getCurrentYear, entranceYearRange } from '../../src/utilities';

const startYear = getCurrentYear() - entranceYearRange;

// Before running tests, starts on landing page, logs in to firebase, then visits the dashboard
// Log in occurs with TEST_UID of the courseplan testing account using a function from the cypress-firebase package
before('Visit site logged in', () => {
  cy.visit('localhost:8080/login');
  cy.login(Cypress.env('TEST_UID'));
  cy.visit('localhost:8080');
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(5000); // ensure the page has time to load
});

// After logging in for the first time, the onboarding process begins
it('Onboarding Process', () => {
  // set Entrance semester to 2022
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

  // set Graduation semester to Summer 2026
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

  cy.get('[data-cyId=onboarding-dropdown]').eq(3).click();
  cy.get('[data-cyId=onboarding-dropdownItem]').each($el => {
    cy.wrap($el)
      .invoke('text')
      .then(text => {
        if (text.includes('2026')) {
          cy.wrap($el).click();
        }
      });
  });

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
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(5000);

  // set to CS major
  cy.get('[data-cyId=onboarding-dropdown]').eq(5).click();
  cy.get('[data-cyId=onboarding-dropdownItem]').each($el => {
    cy.wrap($el)
      .invoke('text')
      .then(text => {
        if (text.includes('Computer Science')) {
          cy.wrap($el).click();
        }
      });
  });
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(5000);

  // click through the rest of onboarding
  cy.get('[data-cyId=onboarding-nextButton]').scrollIntoView().should('be.visible');
  cy.get('[data-cyId=onboarding-nextButton]').click();
  cy.get('[data-cyId=onboarding-nextButton]').scrollIntoView().should('be.visible');
  cy.get('[data-cyId=onboarding-nextButton]').click();

  // confirm Fall 2022, Summer 2026, engineering, and computer science are selected on the review screen
  cy.get('[data-cyId=onboarding-entranceYear]').contains('2022');
  cy.get('[data-cyId=onboarding-entranceSeason]').contains('Fall');
  cy.get('[data-cyId=onboarding-gradYear]').contains('2026');
  cy.get('[data-cyId=onboarding-gradSeason]').contains('Summer');
  cy.get('[data-cyId=onboarding-college]').contains('Engineering');
  cy.get('[data-cyId=onboarding-major]').contains('Computer Science');
  cy.get('[data-cyId=onboarding-finishButton]').click();

  // confirm engineering and computer science are selected on the requirements menu
  cy.get('[data-cyId=majorTitle]').contains('Computer Science');
  cy.get('[data-cyId=collegeTitle]').contains('(Engineering (ENG))');
});

// Test to confirm that the new user walkthrough works as expected
// Click through the initial explanation, then the 4 following steps, and finally the finishing page
it('Click through new feature tour', () => {
  cy.get('.introjs-nextbutton').click();
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

  // confirm the oldest semester is the newly added one
  cy.get('[data-cyId=semesterName]').last().contains(`Fall ${startYear}`);
});

// Confirm that duplicate semesters cannot be added
it('Fail to add a duplicate semester', () => {
  // because a semester exists, get semester-addSemesterButton instead of semesterVIew-addSemesterButton
  cy.get('[data-cyId=semester-addSemesterButton]').click();

  // click fall
  cy.get('[data-cyId=newSemester-seasonWrapper]').first().click();
  cy.get('[data-cyId=newSemester-seasonItem]').first().click();

  // click oldest year
  cy.get('[data-cyId=newSemester-yearWrapper]').first().click();
  cy.get('[data-cyId=newSemester-yearItem]').first().click();

  // confirm button is disabled
  cy.get('[data-cyId=modal-button]').should('be.disabled');

  // exit the modal
  cy.get('[data-cyId=modal-exit]').click();
});

// Confirm that the newly added semester can be edited
it('Edit a semester (Fall of oldest year -> Spring of second oldest year)', () => {
  // open the edit semester menu
  cy.get('[data-cyId=semesterMenu]').first().click();
  cy.get('[data-cyId=semesterMenu-edit]').click();

  // click spring
  cy.get('[data-cyId=newSemester-seasonWrapper]').last().click();
  cy.get('[data-cyId=newSemester-seasonItem]').eq(1).click();

  // click second oldest year
  cy.get('[data-cyId=newSemester-yearWrapper]').last().click();
  cy.get('[data-cyId=newSemester-yearItem]').eq(1).click();

  // finish editing and confirm it has been updated
  cy.get('[data-cyId=modal-button]').click();
  cy.get('[data-cyId=semesterName]')
    .last()
    .contains(`Spring ${startYear + 1}`);
});

// // Delete existing semesters to ensure existing data does not mess with tests
// it('Delete all existing semesters, if any exist', () => {
//   const semesterMenus = '[data-cyId=semesterMenu]';
//   if (Cypress.$(semesterMenus).length > 0) {
//     cy.get(semesterMenus).each($el => {
//       cy.wrap($el).click();
//       cy.get('[data-cyId=semesterMenu-delete]').click();
//       cy.get('[data-cyId=modal-button]').click();
//     });
//   }
// });

// // Test that you can change entrance semester, grad semester, colleges and majors. A later requirements test is dependent on these choices
// it('Switch to engineering college and cs major in class of 2022', () => {
//   cy.get('[data-cyId=editProfile]').click();

//   // set Entrance semester to 2018
//   cy.get('[data-cyId=onboarding-dropdown]').eq(1).click();
//   cy.get('[data-cyId=onboarding-dropdownItem]').each($el => {
//     cy.wrap($el)
//       .invoke('text')
//       .then(text => {
//         if (text.includes('2018')) {
//           cy.wrap($el).click();
//         }
//       });
//   });

//   // set Graduation semester to Summer 2022
//   cy.get('[data-cyId=onboarding-dropdown]').eq(2).click();
//   cy.get('[data-cyId=onboarding-dropdownItem]').each($el => {
//     cy.wrap($el)
//       .invoke('text')
//       .then(text => {
//         if (text.includes('Summer')) {
//           cy.wrap($el).click();
//         }
//       });
//   });

//   cy.get('[data-cyId=onboarding-dropdown]').eq(3).click();
//   cy.get('[data-cyId=onboarding-dropdownItem]').each($el => {
//     cy.wrap($el)
//       .invoke('text')
//       .then(text => {
//         if (text.includes('2022')) {
//           cy.wrap($el).click();
//         }
//       });
//   });

//   // set to Engineering college
//   cy.get('[data-cyId=onboarding-dropdown]').eq(4).click();
//   cy.get('[data-cyId=onboarding-dropdownItem]').each($el => {
//     cy.wrap($el)
//       .invoke('text')
//       .then(text => {
//         if (text.includes('Engineering')) {
//           cy.wrap($el).click();
//         }
//       });
//   });

//   // set to CS major
//   cy.get('[data-cyId=onboarding-dropdown]').eq(5).click();
//   cy.get('[data-cyId=onboarding-dropdownItem]').each($el => {
//     cy.wrap($el)
//       .invoke('text')
//       .then(text => {
//         if (text.includes('Computer Science')) {
//           cy.wrap($el).click();
//         }
//       });
//   });

//   // click through the rest of onboarding
//   cy.get('[data-cyId=onboarding-nextButton]').click();
//   cy.get('[data-cyId=onboarding-nextButton]').click();

//   // confirm Fall 2018, Summer 2022, engineering, and computer science are selected on the review screen
//   cy.get('[data-cyId=onboarding-entranceYear]').contains('2018');
//   cy.get('[data-cyId=onboarding-entranceSeason]').contains('Fall');
//   cy.get('[data-cyId=onboarding-gradYear]').contains('2022');
//   cy.get('[data-cyId=onboarding-gradSeason]').contains('Summer');
//   cy.get('[data-cyId=onboarding-college]').contains('Engineering');
//   cy.get('[data-cyId=onboarding-major]').contains('Computer Science');
//   cy.get('[data-cyId=onboarding-finishButton]').click();

//   // confirm engineering and computer science are selected on the requirements menu
//   cy.get('[data-cyId=majorTitle]').contains('Computer Science');
//   cy.get('[data-cyId=collegeTitle]').contains('(Engineering (ENG))');
// });

// // This test not only adds CS 1110, but confirms the new add modal has the correct requirements,
// // the course was properly added, and that it was assigned to the correct requirement
// it('Add a course with the new add modal (CS 1110)', () => {
//   // open add modal and try to add CS 1110
//   cy.get('[data-cyId=semester-addCourse]').click();
//   cy.get('[data-cyId=newCourse-dropdown]').type('CS 1110');
//   cy.get('[data-cyId=newCourse-searchResult]').first().click();

//   // confirm that the results of the add modal are expected
//   cy.get('[data-cyId=newCourse-selectedCourse]').contains(
//     'CS 1110: Introduction to Computing: A Design and Development Perspective'
//   );
//   cy.get('[data-cyId=newCourse-requirements]').contains('Introductory Programming');

//   // click to edit requirements
//   cy.get('[data-cyId=newCourse-link]').click();
//   cy.get('[data-cyId=newCourse-requirementsDropdown]').click();

//   // confirm we have the correct options by matching each dropdown element

//   // TODO - breaking only on the CI, investigate

//   // let reqOptions = ['Advisor-Approved Electives', 'Major-approved Elective(s)', 'None'];
//   // cy.get('[data-cyId=newCourse-reqOption]').each(($el, i) => {
//   //   cy.wrap($el).contains(reqOptions[i]);
//   // });

//   // keep it assigned to the default introductory programming requirement
//   cy.get('[data-cyId=newCourse-requirementsDropdown]').click();
//   cy.get('[data-cyId=modal-button]').click();
//   cy.get('[data-cyId=modal-button]').click();

//   // confirm the only course in plan is CS 1110
//   cy.get('[data-cyId=courseCode]').contains('CS 1110');

//   // confirm that the only subreq completed has CS 1110 assigned to it (Computing)
//   cy.get('[data-cyId=requirements-viewMore]').first().click();
//   cy.get('[data-cyId=requirements-showCompleted]').click();
//   cy.get('[data-cyId=requirements-displayToggle]').last().click();
//   cy.get('[data-cyId=reqcourse-code]').first().contains('CS 1110');
// });

// // Confirm that the minimize semester button can hide/show semester
// it('Minimize a semester', () => {
//   // open add modal and try to add CS 3110
//   cy.get('[data-cyId=semester-addCourse]').click();
//   cy.get('[data-cyId=newCourse-dropdown]').type('CS 3110');
//   cy.get('[data-cyId=newCourse-searchResult]').first().click();
//   cy.get('[data-cyId=modal-button]').click();

//   // click minimize semester button
//   cy.get('[data-cyId=minimizeSemester]').click();

//   // confirm semester is hidden, course is invisible, add course modal is invisible
//   cy.get('[data-cyId=semester-courses]').should('have.class', 'semester-hidden');
//   cy.get('[data-cyId=semester-course]').should('not.be.visible');
//   cy.get('[data-cyId=semester-addCourse]').should('not.be.visible');

//   // click minimize semester button (expand)
//   cy.get('[data-cyId=minimizeSemester]').click();

//   // confirm semester is shown, course is visible, add course modal is visible
//   cy.get('[data-cyId=semester-courses]').should('not.have.class', 'semester-hidden');
//   cy.get('[data-cyId=semester-course]').should('be.visible');
//   cy.get('[data-cyId=semester-addCourse]').should('be.visible');
// });

// it('Multiple plans dropdown open/close', () => {
//   // dropdown initially closed
//   cy.get('[data-cyId=multiplePlans-dropdown-content]').should('not.exist');
//   cy.get('[data-cyId=multiplePlans-dropdown-open]').click();
//   // dropdown opens
//   cy.get('[data-cyId=multiplePlans-dropdown-content]').should('be.visible');
//   cy.get('[data-cyId=multiplePlans-dropdown-close]').click();
//   // dropdown closed again
//   cy.get('[data-cyId=multiplePlans-dropdown-content]').should('not.exist');
// });
