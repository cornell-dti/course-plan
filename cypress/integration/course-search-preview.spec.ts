/// <reference types="cypress" />
import 'cypress-firebase';

const appUrl = 'http://localhost:8080';
const input = '.autocomplete input';
const preview = '[data-cyId=course-search-preview-dialog]';
const closePreview = '[data-cyId=course-search-preview-close]';
const result = '[data-cyId=newCourse-searchResult]';
const previewButton = '[data-cyId=course-search-preview]';
const email = Cypress.env('TEST_EMAIL');
const backups: Record<string, Record<string, unknown> | null> = {};

const plannedCourse = (number: string, id: number, crseId: number, name: string) => ({
  type: 'CornellCourse',
  uniqueID: id,
  crseId,
  code: `CS ${number}`,
  name,
  credits: 4,
  creditRange: [4, 4],
  semesters: ['Fall', 'Spring'],
  requirementsFulfilled: [],
  color: '318663',
  lastRoster: 'SP27',
});
const semesters = [
  {
    season: 'Spring',
    year: 2027,
    courses: [
      plannedCourse(
        '1110',
        1,
        358526,
        'Introduction to Computing: A Design and Development Perspective'
      ),
      plannedCourse('2110', 2, 358546, 'Object-Oriented Programming and Data Structures'),
    ],
  },
];

// Only the configured development test account is seeded; every document is restored afterwards.
const fixtures: Record<string, Record<string, unknown>> = {
  'user-name': { firstName: 'Course', middleName: '', lastName: 'Preview Test' },
  'user-semesters': {
    plans: [{ name: 'Course preview test', semesters }],
    semesters,
    savedCourses: [{ name: 'Saved Courses', courses: [] }],
    orderByNewest: true,
  },
  'user-onboarding-data': {
    entranceYear: '2026',
    entranceSem: 'Fall',
    gradYear: '2030',
    gradSem: 'Spring',
    colleges: [{ acronym: 'ENG' }],
    majors: [{ acronym: 'CS' }],
    minors: [],
    gradPrograms: [],
    exam: [],
    tookSwim: 'yes',
    sawNewFeature: true,
    sawGiveaway: true,
    sawScheduleGenerator: true,
    fa25giveaway: { saw: true, step1: false, step2: false, step3: false, entered: false },
    dismissedPreEnrollBanner: {},
  },
  'user-toggleable-requirement-choices': {},
  'user-overridden-fulfillment-choices': {},
  'user-subject-colors': { CS: '318663' },
  'user-unique-incrementer': { uniqueIncrementer: 2, uniqueBlankCourseIncrementer: 0 },
};

const openAddCourse = () => cy.get('[data-cyId=semester-addCourse]').first().click();
const search = (query = 'CS') =>
  cy.get<HTMLInputElement>(input).should('be.visible').clear().type(query);
const checkPreview = () => {
  cy.get(preview).should('be.visible');
  cy.get(closePreview).should('have.focus');
  cy.get(`${preview} .bottombarcourse-wrapper`).should('be.visible');
  cy.get(`${preview} header`).should('have.css', 'background-color', 'rgb(49, 134, 99)');
};

describe('Course information previews in all course searches', () => {
  before(() => {
    expect(email, 'configured development test account').to.equal(
      'courseplan.cornelldti.test@gmail.com'
    );
    cy.visit(`${appUrl}/login`);
    cy.login(Cypress.env('TEST_UID'));
    Object.entries(fixtures).forEach(([collection, data]) => {
      const path = `${collection}/${email}`;
      cy.callFirestore('get', path).then(previous => {
        backups[collection] = previous;
      });
      cy.callFirestore('set', path, data);
    });
  });

  beforeEach(() => {
    cy.intercept('POST', 'https://www.cureviews.org/api/courses/get-by-info', {
      body: { result: { classRating: 4.5, classDifficulty: 2.3, classWorkload: 3 } },
    });
    cy.viewport(1440, 900);
    cy.visit(appUrl);
    cy.get('[data-cyId=semester-addCourse]', { timeout: 30000 }).should('be.visible');
  });

  after(() => {
    if (Object.keys(backups).length === 0) return;
    cy.visit(`${appUrl}/login`);
    cy.logout();
    Object.entries(backups).forEach(([collection, previous]) => {
      const path = `${collection}/${email}`;
      if (previous === null) cy.callFirestore('delete', path);
      else cy.callFirestore('set', path, previous);
    });
  });

  it('previews without changing BottomBar tabs, restores the search, and still selects course text', () => {
    cy.get('[data-cyId=courseCode]').contains('CS 1110').click();
    cy.get('.bottombartab').should('have.length', 1);
    cy.get('[data-cyId=courseCode]').contains('CS 2110').click();
    cy.get('.bottombartab').should('have.length', 2);
    cy.get('.bottombar-square-title').invoke('text').as('bottomTitle');
    cy.get('.bottombartab-name').then(tabs => {
      const tabNames = tabs.toArray().map(tab => tab.textContent);
      openAddCourse();
      search();
      cy.get<HTMLInputElement>(input)
        .type('{downarrow}{downarrow}')
        .then(field => {
          field[0].setSelectionRange(1, 1);
        });
      cy.get('.autocomplete-items').scrollTo(0, 100).invoke('scrollTop').as('searchScroll');
      cy.get('.autocomplete-active').invoke('text').as('highlightedCourse');
      cy.get('.autocomplete-active').find(previewButton).click();
      checkPreview();
      cy.get(`${preview} a`).last().focus().trigger('keydown', { key: 'Tab' });
      cy.get(closePreview).should('have.focus');
      cy.get(closePreview).trigger('keydown', { key: 'Tab', shiftKey: true });
      cy.get(`${preview} a`).last().should('have.focus');
      cy.get(closePreview).click();
      cy.get<HTMLInputElement>(input)
        .should('have.value', 'CS')
        .and('have.focus')
        .then(field => {
          expect(field[0].selectionStart).to.equal(1);
        });
      cy.get('@searchScroll').then(scroll =>
        cy.get('.autocomplete-items').invoke('scrollTop').should('equal', scroll)
      );
      cy.get('@highlightedCourse').then(text =>
        cy.get('.autocomplete-active').should('have.text', text)
      );
      cy.get('.bottombartab-name').then(tabsAfter => {
        expect(tabsAfter.toArray().map(tab => tab.textContent)).to.deep.equal(tabNames);
      });
      cy.get('@bottomTitle').then(title =>
        cy.get('.bottombar-square-title').should('have.text', title)
      );
      search('CS 4160');
      cy.get(result).first().find('.search-result-text').click();
      cy.get('[data-cyId=newCourse-selectedCourse]').should('contain', 'CS 4160');
      cy.get(preview).should('not.exist');
      cy.get('[data-cyId=modal-exit]').click();
      cy.callFirestore('get', `user-semesters/${email}`).should(
        'deep.equal',
        fixtures['user-semesters']
      );
      cy.callFirestore('get', `user-unique-incrementer/${email}`).should(
        'deep.equal',
        fixtures['user-unique-incrementer']
      );
    });
  });

  it('supports arrow keys, Tab, Enter, Space, Escape, empty results, and normal Enter selection', () => {
    openAddCourse();
    search('CS 4160');
    cy.get<HTMLInputElement>(input).type('{downarrow}').trigger('keydown', { key: 'Tab' });
    cy.get('.autocomplete-active').find(previewButton).should('have.focus').type('{enter}');
    checkPreview();
    cy.get(closePreview).type('{esc}');
    cy.get<HTMLInputElement>(input).should('have.focus').and('have.value', 'CS 4160');
    cy.get<HTMLInputElement>(input).trigger('keydown', { key: 'Tab' });
    cy.get('.autocomplete-active').find(previewButton).should('have.focus').type(' ');
    checkPreview();
    cy.get(closePreview).click();
    search('does not match any course 123456789');
    cy.get<HTMLInputElement>(input).type('{downarrow}{uparrow}{enter}');
    cy.get(preview).should('not.exist');
    search('CS');
    cy.get<HTMLInputElement>(input).type('{uparrow}');
    cy.get(result).last().should('have.class', 'autocomplete-active');
    search('CS 4160');
    cy.get<HTMLInputElement>(input).type('{enter}');
    cy.get('[data-cyId=newCourse-selectedCourse]').should('contain', 'CS 4160');
  });

  it('keeps the desktop columns and bounds the long title, close button, and scrolling on mobile', () => {
    openAddCourse();
    search('CS 1110');
    cy.get(result).first().find(previewButton).focus().click();
    checkPreview();
    cy.get(`${preview} .bottombarcourse-wrapper`).then(wrapper => {
      cy.get(`${preview} .bottombarcourse-bar-info`).then(info => {
        expect(info[0].getBoundingClientRect().width).to.be.closeTo(
          wrapper[0].getBoundingClientRect().width * 0.4,
          1
        );
      });
    });
    cy.viewport(403, 762);
    cy.get(preview).then(dialog => {
      const bounds = dialog[0].getBoundingClientRect();
      expect(bounds.left).to.be.at.least(16);
      expect(bounds.right).to.be.at.most(403 - 16);
      cy.get(closePreview).then(button => {
        expect(button[0].getBoundingClientRect().right).to.be.at.most(bounds.right);
      });
      cy.get(`${preview} header`).then(header => {
        expect(header[0].getBoundingClientRect().width).to.be.at.most(bounds.width);
      });
    });
    cy.get(`${preview} .bottombarcourse-bar-info`).then(info => {
      cy.get(`${preview} .bottombarcourse-bar-details`).then(details => {
        expect(details[0].getBoundingClientRect().top).to.be.at.least(
          info[0].getBoundingClientRect().bottom - 1
        );
      });
    });
    cy.get(`${preview} .bottombarcourse-wrapper`).scrollTo('bottom');
    cy.get(`${preview} .details`).should('be.visible');
    cy.get(closePreview).click();
    cy.get<HTMLInputElement>(input).should('have.focus').and('have.value', 'CS 1110');
  });

  it('returns to self-check requirement search with the semester form preserved', () => {
    cy.get('[data-cyId=requirements-viewMore]').eq(1).click();
    cy.contains('[data-cyId=requirements-displayToggle]', 'Major-approved Elective(s)').click();
    cy.get('.incompleteselfcheck .dropdown-wrapper').first().click();
    cy.contains(
      '.incompleteselfcheck .dropdown-content-item',
      '+ Add new course to schedule'
    ).click();
    cy.get('.selectSemester .season-wrapper').click();
    cy.contains('.selectSemester-dropdown-content-item', 'Fall').click();
    search('CS 4160');
    cy.get(result).first().find(previewButton).click();
    checkPreview();
    cy.get(closePreview).type('{esc}');
    cy.get<HTMLInputElement>(input).should('have.focus').and('have.value', 'CS 4160');
    cy.get('.selectSemester .season-placeholder').should('contain', 'Fall');
    cy.get('.modal-button--add').should('be.disabled');
    cy.get<HTMLInputElement>(input).type('{enter}');
    cy.get('.selected-course').should('contain', 'CS 4160');
  });

  it('returns to equivalent-course search without advancing the blank-course workflow', () => {
    openAddCourse();
    cy.contains('button', '+ Add Blank Course Card').click();
    cy.get('#courseCode').type('CSE 114');
    cy.get('#courseName').type('Transfer course preview test');
    cy.get('[data-cyId=modal-button]').click();
    search('CS 4160');
    cy.get(result).first().find(previewButton).click();
    checkPreview();
    cy.get(closePreview).click();
    cy.get<HTMLInputElement>(input).should('have.focus').and('have.value', 'CS 4160');
    cy.get('.modal-button--add').should('be.disabled');
    cy.get(result).first().find('.search-result-text').click();
    cy.get('.section-text').should('contain', 'CS 4160');
    cy.get('.modal-button--add').should('not.be.disabled');
  });
});
