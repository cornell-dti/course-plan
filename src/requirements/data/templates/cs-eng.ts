const csEngTemplate: readonly MajorTemplate[] = [
  {
    reqGroup: 'EN',
    name: 'Mathematics',
    templateSemesters: [1, 2, 3],
  },
  {
    reqGroup: 'CS',
    name: 'Introductory Programming',
    templateSemesters: [1, 3],
  },
  {
    reqGroup: 'CS',
    name: 'Computer Science Core',
    templateSemesters: [3, 5, 4, 6, 7],
  },
  // more complex version of above to handle edge cases if desired 
  // (incomplete templates, different checkers)
  {
    reqGroup: 'CS',
    name: 'Computer Science Core',
    templateSemesters: {
      "3": { 
        slotName: "CS 2800 or CS 2802", 
        checker?: newCheckerForSlot, 
        placeholderName?: "CS 280X" }
      ...
    },
  },
  {
    reqGroup: 'CS',
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
