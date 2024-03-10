import { Course, CollegeOrMajorRequirement } from '../../requirements/types';
import {
  includesWithSingleRequirement,
  includesWithSubRequirements,
  ifCodeMatch,
} from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

const vienRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Physical Science Core',
    description:
      'To fulfill the Physical Science Core, must complete one Intro to biology course, PLSCI 1420, and BIOMI 2900.',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28379&hl=viticulture&returnto=search',
    checker: includesWithSubRequirements(
      ['BIOMG 1350', 'BIOG 1140', 'BIOG 1440', 'BIOEE 1610', 'BIOEE 1780'],
      ['PLSCI 1420'],
      ['BIOMI 2900']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: ['Introductory biology courses', 'PLSCI 1420', 'BIOMI 2900'],
  },
  {
    name: 'Chemistry',
    description:
      'To fulfill the Chemistry requirement, must complete CHEM 1560, CHEM 1570, and one of the following: BIOMG 3300, BIOMG 3310, BIOMG 3350, NS 3200. BIOMG 3320 or BIOMG 3330 are not counted towards the Biochemistry requirement.',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28379&hl=viticulture&returnto=search',
    checker: includesWithSubRequirements(
      ['CHEM 1560'],
      ['CHEM 1570'],
      ['BIOMG 3300', 'BIOMG 3310', 'BIOMG 3350', 'NS 3200']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1],
    slotNames: ['CHEM 1560', 'CHEM 1570', 'Biochemistry'],
  },
  {
    name: 'Statistics',
    description:
      'To fulfill the Statistics core, must complete one of the following Introductory Statistics course: STSCI 2200, STSCI 2100, and STSCI 2150.',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28379&hl=viticulture&returnto=search',
    checker: includesWithSingleRequirement('STSCI 2200', 'STSCI 2100', 'STSCI 2150'),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Introductory Statistics Course'],
  },
  {
    name: 'Plant Science',
    description: 'To fulfill the Plant Science core, must complete PLBIO 2410 and PLSCS 2600.',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28379&hl=viticulture&returnto=search',
    checker: includesWithSingleRequirement('PLBIO 2410', 'PLSCS 2600'),
    fulfilledBy: 'courses',
    perSlotMinCount: [2],
    slotNames: ['PLBIO 2410 and PLSCS 2600'],
  },

  {
    name: 'Viticulture & Enology Core',
    description:
      'All major requirements must be taken for a letter grade, except when not an option, or if taken during Spring 2020 or Fall 2020. All required V&E Core and Major Elective courses must be completed with a C- or better. Both lecture and laboratory section must be taken for major elective credit. Students taking only the lecture will not receive credit for the course towards completion of the major.',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28379&hl=viticulture&returnto=search',
    checker: includesWithSubRequirements(
      ['VIEN 1104', 'VIEN 1105'],
      ['VIEN 2204', 'VIEN 2205', 'FDSC 2110', 'VIEN 2400'],
      ['VIEN 3610'],
      ['VIEN 4700', 'VIEN 4710', 'VIEN 4980'],
      ['VIEN 3300', 'VIEN 3200']
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [2, 4, 1, 3, 1],
    slotNames: ['Course 1XXX', 'Course 2XXX', 'VIEN 3610', 'Course 4XXX', 'VIEN 3300 or VIEN 3200'],
  },
  {
    name: 'Major-approved Elective(s)',
    description:
      'At least 17 credits totals. At least 5 credits of major electives must be VIEN classes. There are Electives with Enology Focus, and Electives with Viticulture Focus. All required V&E Core and Major Elective courses must be completed with a C- or better. Both lecture and laboratory section must be taken for major elective credit. Students taking only the lecture will not receive credit for the course towards completion of the major.',
    source:
      'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28379&hl=viticulture&returnto=search',
    checker: [
      (course: Course): boolean => {
        const { subject } = course;
        return (
          ifCodeMatch(subject, 'VIEN') ||
          ifCodeMatch(subject, 'FDSC') ||
          ifCodeMatch(subject, 'HADM') ||
          ifCodeMatch(subject, 'PLSCS') ||
          ifCodeMatch(subject, 'NTRES') ||
          ifCodeMatch(subject, 'GDEV') ||
          ifCodeMatch(subject, 'PLBRG') ||
          ifCodeMatch(subject, 'PLBIO') ||
          ifCodeMatch(subject, 'PLHRT')
        );
      },
    ],
    checkerWarning: `We will not list of major electives for this major. We will not check if a lecture and lab are taken together. Please check with the Course of Studies for all major electives for this major.`,
    fulfilledBy: 'credits',
    perSlotMinCount: [17],
  },
];

export default vienRequirements;

export const vienAdvisors: AdvisorGroup = {
  advisors: [{ name: 'Kathleen Arnink', email: 'kja1@cornell.edu' }],
};
