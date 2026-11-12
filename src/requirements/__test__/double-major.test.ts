/**
 * Double-major audit tests.
 *
 * Documents double-major behaviour. The skipped `[BUG-latent]` test describes a known,
 * currently unreachable issue in specialize.ts.
 */
import requirementJson from '../typed-requirement-json';
import specialized from '../specialize';
import {
  allowCourseDoubleCountingBetweenRequirements,
  getRelatedRequirementIdsForCourseOptOut,
  getUserRequirements,
} from '../requirement-frontend-utils';
import buildRequirementFulfillmentGraphFromUserData from '../requirement-graph-builder-from-user-data';
import computeGroupedRequirementFulfillmentReports from '../requirement-frontend-computation';

const onboarding = (
  college: string,
  major: readonly string[],
  overrides: Partial<AppOnboardingData> = {}
): AppOnboardingData => ({
  gradYear: '2027',
  gradSem: 'Spring',
  entranceYear: '2023',
  entranceSem: 'Fall',
  college,
  major,
  minor: [],
  grad: '',
  exam: [],
  tookSwim: 'no',
  sawNewFeature: true,
  sawGiveaway: true,
  fa25giveaway: { saw: true, step1: true, step2: true, step3: true, entered: true },
  sawScheduleGenerator: true,
  ...overrides,
});

const course = (courseId: number, code: string, uniqueId = 1, credits = 4): CourseTaken => ({
  courseId,
  uniqueId,
  code,
  credits,
});

// Real course ids from src/assets/courses/full-courses.json
const AMST_1500 = 365511; // AFRICANA "Core Course" and GOVT "Tenth Government Course"
const ITAL_2204 = 357443; // ITALIAN "Core Courses" and A&S "Foreign Language"
const PHIL_2310 = 353862; // == COGST 2310; COGSCI "Introductory Core" and PHIL "Eight Core Philosophy Courses"

const mockReq = (
  sourceType: 'College' | 'Major' | 'Minor' | 'Grad',
  sourceSpecificName: string,
  name: string,
  allowCourseDoubleCounting?: true
): RequirementWithIDSourceType => ({
  id: `${sourceType}-${sourceSpecificName}-${name}`,
  name,
  description: '',
  source: '',
  sourceType,
  sourceSpecificName,
  fulfilledBy: 'self-check',
  ...(allowCourseDoubleCounting ? { allowCourseDoubleCounting } : {}),
});

describe('allowCourseDoubleCountingBetweenRequirements: rule matrix (documents current behaviour)', () => {
  const majorA1 = mockReq('Major', 'A', 'r1');
  const majorA2 = mockReq('Major', 'A', 'r2');
  const majorA2Flag = mockReq('Major', 'A', 'r2', true);
  const majorB1 = mockReq('Major', 'B', 'r1');
  const college = mockReq('College', 'AS2', 'c');
  const collegeFlag = mockReq('College', 'AS2', 'c', true);
  const minor = mockReq('Minor', 'M', 'm');
  const grad = mockReq('Grad', 'G', 'g');
  const gradFlag = mockReq('Grad', 'G', 'g', true);

  it('two different majors always double count (no limit, flags irrelevant)', () => {
    expect(allowCourseDoubleCountingBetweenRequirements(majorA1, majorB1)).toBe(true);
  });

  it('same major: only when either side is flagged', () => {
    expect(allowCourseDoubleCountingBetweenRequirements(majorA1, majorA2)).toBe(false);
    expect(allowCourseDoubleCountingBetweenRequirements(majorA1, majorA2Flag)).toBe(true);
  });

  it('major vs college: only when either side is flagged', () => {
    expect(allowCourseDoubleCountingBetweenRequirements(majorA1, college)).toBe(false);
    expect(allowCourseDoubleCountingBetweenRequirements(majorA1, collegeFlag)).toBe(true);
  });

  it('a flag meant for same-major overlap also opens major-vs-college overlap (one flag, two scopes)', () => {
    // e.g. PHIL "Greek and Roman Philosophy" is flagged so PHIL 2200 can also count toward
    // "Eight Core Philosophy Courses"; as a side effect it may also share with any college req.
    expect(allowCourseDoubleCountingBetweenRequirements(majorA2Flag, college)).toBe(true);
  });

  it('minor vs college/major always allowed; grad vs anything else never (grad flag ignored)', () => {
    expect(allowCourseDoubleCountingBetweenRequirements(minor, majorA1)).toBe(true);
    expect(allowCourseDoubleCountingBetweenRequirements(minor, college)).toBe(true);
    expect(allowCourseDoubleCountingBetweenRequirements(minor, grad)).toBe(false);
    expect(allowCourseDoubleCountingBetweenRequirements(gradFlag, collegeFlag)).toBe(false);
  });

  it('is symmetric over every pair of real requirements for AS2 + PHIL + COGSCI + CS minor + MPA', () => {
    const reqs = getUserRequirements(
      onboarding('AS2', ['PHIL', 'COGSCI'], { minor: ['CS'], grad: 'MPA' })
    );
    reqs.forEach(a =>
      reqs.forEach(b => {
        expect(allowCourseDoubleCountingBetweenRequirements(a, b)).toBe(
          allowCourseDoubleCountingBetweenRequirements(b, a)
        );
      })
    );
  });

  it('returns false when either requirement is undefined (stale id) -- see stale opt-in bug below', () => {
    expect(
      allowCourseDoubleCountingBetweenRequirements(
        collegeFlag,
        (undefined as unknown) as RequirementWithIDSourceType
      )
    ).toBe(false);
  });
});

describe('getUserRequirements with two majors (real data)', () => {
  it('two A&S majors: unique ids, both majors present, majors in input order', () => {
    const reqs = getUserRequirements(onboarding('AS2', ['PHIL', 'COGSCI']));
    const ids = reqs.map(r => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    const majorOrder = Array.from(
      new Set(reqs.filter(r => r.sourceType === 'Major').map(r => r.sourceSpecificName))
    );
    expect(majorOrder).toEqual(['PHIL', 'COGSCI']);
  });

  it('result set does not depend on major order', () => {
    const ab = getUserRequirements(onboarding('AS2', ['PHIL', 'COGSCI'])).map(r => r.id);
    const ba = getUserRequirements(onboarding('AS2', ['COGSCI', 'PHIL'])).map(r => r.id);
    expect(new Set(ab)).toEqual(new Set(ba));
  });

  it('every major x each of its schools yields unique requirement ids (no Major-X-name collisions)', () => {
    Object.entries(requirementJson.major).forEach(([key, major]) => {
      major.schools.forEach(school => {
        ['2018', '2023'].forEach(entranceYear => {
          const ids = getUserRequirements(onboarding(school, [key], { entranceYear })).map(
            r => r.id
          );
          expect({ key, school, dupes: ids.filter((id, i) => ids.indexOf(id) !== i) }).toEqual({
            key,
            school,
            dupes: [],
          });
        });
      });
    });
  });

  it('CS specializations (EN) only replace EN college reqs; no-op for CS in AS2', () => {
    const asCollege = getUserRequirements(onboarding('AS2', ['CS', 'MATH'])).filter(
      r => r.sourceType === 'College' && r.id.startsWith('College-AS2-')
    );
    const asCollegeBaseline = getUserRequirements(onboarding('AS2', ['MATH'])).filter(
      r => r.sourceType === 'College' && r.id.startsWith('College-AS2-')
    );
    expect(asCollege).toEqual(asCollegeBaseline);

    const enMath = getUserRequirements(onboarding('EN', ['ECE', 'CS'])).find(
      r => r.id === 'College-EN-Mathematics'
    );
    expect(enMath?.description).toContain('2940');
  });

  it('duplicate major acronyms are deduplicated (unique requirement ids)', () => {
    // UI multi-dropdown prevents this, but Firestore data / other writers do not.
    const ids = getUserRequirements(onboarding('AS2', ['PHIL', 'PHIL'])).map(r => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('specialized() with two majors (latent: only CS has specializations today)', () => {
  const collegeReqs = [{ name: 'Mathematics', description: 'college' }] as RequirementCommon[];
  const majorX = {
    name: 'X',
    schools: ['EN'],
    requirements: [],
    specializations: [{ name: 'Mathematics', description: 'X version' }],
  };
  const majorY = {
    name: 'Y',
    schools: ['EN'],
    requirements: [],
    specializations: [{ name: 'Mathematics', description: 'Y version' }],
  };

  it.skip('[BUG-latent, unfixed: only CS has specializations today] conflicting specializations of the same college requirement are order dependent', () => {
    // A student double majoring in X and Y must satisfy both, but whichever major is listed last
    // silently wins and the other's specialization is dropped.
    const xy = specialized(collegeReqs, [majorX, majorY] as never);
    const yx = specialized(collegeReqs, [majorY, majorX] as never);
    expect(xy).toEqual(yx);
  });
});

describe('graph construction with two majors (real data)', () => {
  it('a course eligible for one requirement in each of two majors counts toward both (safe graph)', () => {
    const {
      safeRequirementFulfillmentGraph,
      doubleCountedCourseUniqueIDSet,
    } = buildRequirementFulfillmentGraphFromUserData(
      [course(AMST_1500, 'AMST 1500')],
      onboarding('AS2', ['AFRICANA', 'GOVT']),
      {},
      {}
    );
    const reqs = safeRequirementFulfillmentGraph
      .getConnectedRequirementsFromCourse({ uniqueId: 1 })
      .filter(r => r.startsWith('Major-'));
    expect(reqs).toEqual(
      expect.arrayContaining(['Major-AFRICANA-Core Course', 'Major-GOVT-Tenth Government Course'])
    );
    expect(doubleCountedCourseUniqueIDSet.has(1)).toBe(false);
  });

  it('a language course counts toward both the A&S Foreign Language requirement and a language major (CS + ITALIAN)', () => {
    for (const college of ['AS1', 'AS2']) {
      const data = onboarding(college, ['CS', 'ITALIAN'], {
        entranceYear: college === 'AS1' ? '2019' : '2023',
      });
      const { safeRequirementFulfillmentGraph } = buildRequirementFulfillmentGraphFromUserData(
        [course(ITAL_2204, 'ITAL 2204')],
        data,
        {},
        {}
      );
      expect(
        safeRequirementFulfillmentGraph.getConnectedRequirementsFromCourse({ uniqueId: 1 })
      ).toEqual(
        expect.arrayContaining([
          `College-${college}-Foreign Language`,
          'Major-ITALIAN-Core Courses',
        ])
      );
      // and adding it must not opt the course out of the Italian major
      const {
        groupedRequirementFulfillmentReport,
        userRequirementsMap,
      } = computeGroupedRequirementFulfillmentReports([], data, {}, {});
      expect(
        getRelatedRequirementIdsForCourseOptOut(
          ITAL_2204,
          `College-${college}-Foreign Language`,
          groupedRequirementFulfillmentReport,
          {},
          userRequirementsMap
        )
      ).not.toContain('Major-ITALIAN-Core Courses');
    }
  });

  it('opt-out on add never asks to opt out of the *other* major', () => {
    const {
      groupedRequirementFulfillmentReport,
      userRequirementsMap,
    } = computeGroupedRequirementFulfillmentReports(
      [],
      onboarding('AS2', ['AFRICANA', 'GOVT']),
      {},
      {}
    );
    const optOut = getRelatedRequirementIdsForCourseOptOut(
      AMST_1500,
      'Major-GOVT-Tenth Government Course',
      groupedRequirementFulfillmentReport,
      {},
      userRequirementsMap
    );
    expect(optOut.filter(id => id.startsWith('Major-AFRICANA-'))).toEqual([]);
  });

  it('grouped report: one Major group per selected major, in onboarding order (sidebar relies on index)', () => {
    const { groupedRequirementFulfillmentReport } = computeGroupedRequirementFulfillmentReports(
      [],
      onboarding('AS2', ['PHIL', 'COGSCI'], { minor: ['CS'] }),
      {},
      {}
    );
    expect(groupedRequirementFulfillmentReport.map(g => `${g.groupName}:${g.specific}`)).toEqual([
      'College:AS2',
      'Major:PHIL',
      'Major:COGSCI',
      'Minor:CS',
    ]);
  });

  it('unknown/stale major acronym produces no requirement group', () => {
    // RequirementSideBar.showMajorOrMinorRequirements / RequirementHeader index groups by
    // onboardingData.major.length, but unknown majors produce no group.
    const data = onboarding('AS2', ['PHIL', 'NOT_A_MAJOR', 'COGSCI'], { minor: ['CS'] });
    const { groupedRequirementFulfillmentReport } = computeGroupedRequirementFulfillmentReports(
      [],
      data,
      {},
      {}
    );
    const majorGroups = groupedRequirementFulfillmentReport.filter(g => g.groupName === 'Major');
    // getUserRequirements drops the unknown major; createAppOnboardingData drops it from
    // onboardingData.major too, so the sidebar index math lines up.
    expect(majorGroups.length).toBe(data.major.filter(m => m in requirementJson.major).length);
  });

  it('stale opt-in to a removed major requirement does not knock the course out of remaining requirements', () => {
    // User double majors PHIL + COGSCI. PHIL reqs all carry checkerWarnings, so PHIL 2310 is
    // attached to "Eight Core Philosophy Courses" via acknowledgedCheckerWarningOptIn.
    // User then drops PHIL. The opt-in is never cleaned up.
    const courses = [course(PHIL_2310, 'PHIL 2310')];
    const choices: FirestoreOverriddenFulfillmentChoices = {
      1: {
        optOut: [],
        arbitraryOptIn: {},
        acknowledgedCheckerWarningOptIn: ['Major-PHIL-Eight Core Philosophy Courses'],
      },
    };

    // Sanity: while both majors are selected, the course counts toward COGSCI Introductory Core.
    const before = buildRequirementFulfillmentGraphFromUserData(
      courses,
      onboarding('AS2', ['PHIL', 'COGSCI']),
      {},
      choices
    );
    expect(
      before.safeRequirementFulfillmentGraph.getConnectedRequirementsFromCourse({ uniqueId: 1 })
    ).toContain('Major-COGSCI-Introductory Core');

    // After dropping PHIL, it should still count toward COGSCI + A&S credits.
    const after = buildRequirementFulfillmentGraphFromUserData(
      courses,
      onboarding('AS2', ['COGSCI']),
      {},
      choices
    );
    expect(
      after.safeRequirementFulfillmentGraph.getConnectedRequirementsFromCourse({ uniqueId: 1 })
    ).toEqual(
      expect.arrayContaining(['Major-COGSCI-Introductory Core', 'College-AS2-A&S Credits'])
    );
    expect(after.doubleCountedCourseUniqueIDSet.has(1)).toBe(false);
  });
});

describe('onboarding college change (mirrors OnboardingBasic.vue clearMajorIfNotInCollege)', () => {
  // Faithful copy of OnboardingBasic.vue:357-372. The component keeps `collegeAcronym` as 'AS'
  // for Arts & Sciences (converted to AS1/AS2 only on save in Onboarding.vue:setASCollegeReqs),
  // but majors list 'AS1'/'AS2' in `schools`.
  const clearMajorIfNotInCollege = (collegeAcronym: string, majorAcronyms: string[]) =>
    majorAcronyms.map(m =>
      m !== '' &&
      requirementJson.major[m]?.schools.includes(collegeAcronym === 'AS' ? 'AS2' : collegeAcronym)
        ? m
        : ''
    );

  it('switching to a college the majors are not in clears them', () => {
    expect(clearMajorIfNotInCollege('EN', ['PHIL', 'COGSCI'])).toEqual(['', '']);
  });

  it('selecting A&S keeps A&S majors (e.g. EN -> AS with CS, or re-selecting AS)', () => {
    expect(clearMajorIfNotInCollege('AS', ['CS', 'PHIL'])).toEqual(['CS', 'PHIL']);
  });
});
