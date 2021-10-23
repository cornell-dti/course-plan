const csEngTemplate: readonly MajorTemplate[] = [
  {
    source: 'EN',
    name: 'Mathematics',
    templateSemesters: [1, 2, 3],
  },
  {
    source: 'CS',
    name: 'Introductory Programming',
    templateSemesters: [1, 3],
  },
  {
    name: 'Computer Science Core',
    templateSemesters: [3, 5, 4, 6, 7],
  },
  {
    name: 'CS Electives',
    templateSemesters: [6, 7, 8],
  },
  {
    name: 'CS Practicum or Project',
    templateSemesters: [8],
  },
  {
    name: 'Technical Electives',
    templateSemesters: [5, 6, 7],
  },
  {
    name: 'External Specialization',
    templateSemesters: [5, 7, 8],
  },
  {
    name: 'Major-approved Elective(s)',
    templateSemesters: [4],
  },
  {
    name: 'Probability',
    templateSemesters: [],
  },
];

export default csEngTemplate;
