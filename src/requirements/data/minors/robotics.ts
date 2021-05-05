import { CollegeOrMajorRequirement } from '../../types';
import { includesWithSingleRequirement } from '../checkers-common';

const roboticsMinorRequirements: readonly CollegeOrMajorRequirement[] = [
  // TODO: can't handle major specific restrictions yet
  // ME majors may not count MAE 3780 if it is used to satisfy the ME circuits requirement
  // ECE majors may not count ECE 3400
  {
    name: 'Fundamentals Courses',
    description: 'Choose three courses.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/majors-and-minors/robotics-minor',
    checker: includesWithSingleRequirement(
      'CS 4750',
      'MAE 4180',
      'CS 4752',
      'MAE 3780',
      'ECE 3400',
      'CS 4700',
      'CS 4754'
    ),
    fulfilledBy: 'courses',
    perSlotMinCount: [3],
    slotNames: ['Course'],
  },
  {
    name: 'Specialization Courses',
    description: 'Choose three courses from a category.',
    source:
      'https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/majors-and-minors/robotics-minor',
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      'Intelligence': {
        description: 'Choose three courses. ',
        counting: 'courses',
        checker: includesWithSingleRequirement(
          'CS 4790',
          'CS 6751',
          'MAE 6770',
          'MAE 6790',
          'ECE 6970',
          'CS 4700',
          'MAE 4180',
          'MAE 6710'
        ),
        perSlotMinCount: [3],
        slotNames: ['Courses'],
      },
      'Modelling, Dynamics, and Control': {
        description: 'Choose three courses. ',
        counting: 'courses',
        checker: includesWithSingleRequirement(
          'MAE 4730',
          'MAE 4710',
          'MAE 4780',
          'CS 4752',
          'MAE 6760',
          'MAE 6770',
          'MAE 6780'
        ),
        perSlotMinCount: [3],
        slotNames: ['Courses'],
      },
      'Perception': {
        description: 'Choose three courses. ',
        counting: 'courses',
        checker: includesWithSingleRequirement(
          'CS 4670',
          'ECE 5470',
          'MAE 6790',
          'MAE 4180',
          'ECE 4320',
          'MAE 6760'
        ),
        perSlotMinCount: [3],
        slotNames: ['Courses'],
      },
      'Systems and Design': {
        description: 'Choose three courses. ',
        counting: 'courses',
        checker: includesWithSingleRequirement(
          'MAE 3780',
          'ECE 3400',
          'ECE 4320',
          'ECE 4760',
          'INFO 4410',
          'INFO 4320',
          'DEA 5210',
          'INFO 4420',
          'ECE 5725',
          'DEA 6210',
          'MAE 6710'
        ),
        perSlotMinCount: [3],
        slotNames: ['Course'],
      },
    },
  },
];

export default roboticsMinorRequirements;
