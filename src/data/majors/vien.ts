import { CollegeOrMajorRequirement } from '../../requirements/types';
import { includesWithSubRequirements } from '../../requirements/checkers';
import { AdvisorGroup } from '../../tools/advisors/types';

// from here
const vienRequirements: readonly CollegeOrMajorRequirement[] = [
  {
    name: 'Physical Science Core',
    description: 'some description',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28379#Coursework',
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
    description: 'some description',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28379#Coursework',
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
    // TODO: NTRES/STSCI 2200, should I keep both or just replace one with the other?
    // look if these are the same course or not
    name: 'Statistics',
    description: 'some description',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28379#Coursework',
    checker: includesWithSubRequirements(['NTRES 3130', 'STSCI 2200', 'STSCI 2100', 'STSCI 2150']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1],
    slotNames: ['Introductory Statistics Course'],
  },
  {
    name: 'Plant Science',
    description: 'some description',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28379#Coursework',
    checker: includesWithSubRequirements(['PLBIO 2410'], ['PLSCS 2600']),
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1],
    slotNames: ['PLBIO 2410', 'PLSCS 2600'],
  },

  {
    // TODO: VIEN 4700/4710 (lecture and lab based must be taken together)
    name: 'Viticulture & Enology Core',
    description: 'some description',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28379#Coursework',
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
    name: 'Major Electives',
    description:
      'Need a mininum of 17 credits. At least 5 credits of major electives must be VIEN classes. There are Electives with Enology Focus, and Electives with Viticulture Focus.',
    source: 'https://courses.cornell.edu/preview_program.php?catoid=55&poid=28379#Coursework',
    checker: includesWithSubRequirements(
      ['VIEN 2310', 'VIEN 4310'],
      ['VIEN 2360', 'VIEN 4360'],
      ['VIEN 2340', 'VIEN 4340'],
      ['VIEN 4500', 'VIEN 4510'],
      [
        'BIOMI 2911',
        'FDSC 2206',
        'FDSC 3940',
        'FDSC 3950',
        'FDSC 4040',
        'FDSC 4100',
        'FDSC 4110',
        'FDSC 4170',
        'FDSC 4190',
        'FDSC 4220',
        'VIEN 4400',
        'HADM 4430',
        'VIEN 4650',
        'VIEN 5660',
      ]
    ),
    checkerWarning: `We will not list of major electives for this major. Please check with the Course of Studies for all major electives for this major.`,
    fulfilledBy: 'credits',
    perSlotMinCount: [17],
  },
];

export default vienRequirements;

export const vienAdvisors: AdvisorGroup = {
  advisors: [{ name: 'John Doe', email: 'johndoe@cornell.edu' }],
};
