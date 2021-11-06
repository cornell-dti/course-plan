import { Template } from '@/requirements/types';

const csEngTemplate: Template = [
  {
    reqGroup: 'UNI',
    name: 'Physical Education',
    placeholderSemesters: [1, 2],
  },
  {
    reqGroup: 'EN',
    name: 'Mathematics',
    placeholderSemesters: [1, 2, 3],
  },
  {
    reqGroup: 'EN',
    name: 'Physics',
    placeholderSemesters: [2, 3],
  },
  {
    reqGroup: 'EN',
    name: 'Chemistry',
    placeholderSemesters: [1],
  },
  {
    reqGroup: 'EN',
    name: 'First-Year Writing Seminars',
    placeholderSemesters: [1, 2],
  },
  {
    reqGroup: 'EN',
    name: 'Introduction to Engineering',
    placeholderSemesters: [2],
  },
  {
    reqGroup: 'EN',
    name: 'Liberal Studies: 6 courses',
    placeholderSemesters: [3, 4, 5, 6, 7, 8],
  },
  {
    reqGroup: 'EN',
    name: 'Advisor-Approved Electives',
    placeholderSemesters: [5, 6],
  },
  // TODO: add back Computing req if a programatic way of finding duplicate placeholders (such as between Computing and Introductory Programming) is implemented
  {
    reqGroup: 'CS',
    name: 'Introductory Programming',
    placeholderSemesters: [1, 3],
  },
  {
    reqGroup: 'CS',
    name: 'Computer Science Core',
    placeholderSemesters: [3, 5, 4, 6, 7],
  },
  {
    reqGroup: 'CS',
    name: 'CS Electives',
    placeholderSemesters: [6, 7, 8],
  },
  {
    reqGroup: 'CS',
    name: 'CS Practicum or Project',
    placeholderSemesters: [8],
  },
  {
    reqGroup: 'CS',
    name: 'Technical Electives',
    placeholderSemesters: [5, 6, 7],
  },
  {
    reqGroup: 'CS',
    name: 'External Specialization',
    placeholderSemesters: [5, 7, 8],
  },
  {
    reqGroup: 'CS',
    name: 'Major-approved Elective(s)',
    placeholderSemesters: [4],
  },
];

export default csEngTemplate;
