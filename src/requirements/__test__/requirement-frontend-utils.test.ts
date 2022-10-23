import { computeFulfillmentCoursesAndStatistics } from '../requirement-frontend-utils';

const mockRequirementCommon = {
  name: '',
  description: '',
  id: 'MOCK_ID',
  source: '',
  sourceType: 'College',
  sourceSpecificName: 'EN',
} as const;

const getMockCourseTaken = (courseId: number, credits = 0): CourseTaken => ({
  courseId,
  uniqueId: 0,
  code: '',
  credits,
});

type StatisticsResultType = RequirementFulfillmentStatisticsWithCourses & {
  readonly additionalRequirements?: {
    readonly [name: string]: RequirementFulfillmentStatisticsWithCourses;
  };
};

it('computeFulfillmentCoursesAndStatistics self-check test', () => {
  const mockRequirement: RequirementWithIDSourceType = {
    ...mockRequirementCommon,
    fulfilledBy: 'self-check',
  };

  // A simple test on self-check.
  expect(
    computeFulfillmentCoursesAndStatistics(mockRequirement, [], {}, {})
  ).toEqual<StatisticsResultType>({
    courses: [],
    fulfilledBy: 'self-check',
    minCountFulfilled: 0,
    minCountRequired: 1,
  });
});

it('computeFulfillmentCoursesAndStatistics credit test', () => {
  const mockRequirement: RequirementWithIDSourceType = {
    ...mockRequirementCommon,
    fulfilledBy: 'credits',
    perSlotMinCount: [11],
    courses: [[1234, 5678, 9101112]],
  };

  // Asserts that the progress is correctly counted.
  expect(
    computeFulfillmentCoursesAndStatistics(
      mockRequirement,
      [getMockCourseTaken(1234, 4), getMockCourseTaken(5678, 4)],
      {},
      {}
    )
  ).toEqual<StatisticsResultType>({
    courses: [[getMockCourseTaken(1234, 4), getMockCourseTaken(5678, 4)]],
    fulfilledBy: 'credits',
    minCountFulfilled: 8,
    minCountRequired: 11,
  });

  // Asserts that the minCountFulfilled can be greater than minCountRequired.
  expect(
    computeFulfillmentCoursesAndStatistics(
      mockRequirement,
      [getMockCourseTaken(1234, 4), getMockCourseTaken(5678, 4), getMockCourseTaken(9101112, 4)],
      {},
      {}
    )
  ).toEqual<StatisticsResultType>({
    courses: [
      [getMockCourseTaken(1234, 4), getMockCourseTaken(5678, 4), getMockCourseTaken(9101112, 4)],
    ],
    fulfilledBy: 'credits',
    minCountFulfilled: 12,
    minCountRequired: 11,
  });
});

it('computeFulfillmentCoursesAndStatistics course (without minNumberOfSlots) test', () => {
  const mockRequirement: RequirementWithIDSourceType = {
    ...mockRequirementCommon,
    fulfilledBy: 'courses',
    perSlotMinCount: [2, 1, 1],
    slotNames: ['', '', ''],
    courses: [
      [1, 2],
      [3, 4],
      [3, 4],
    ],
  };

  // Asserts that if a slot is already filled according to its perSlotMinCount,
  // no more courses will be added to the slot, and the course will be added to the next matching slot.
  expect(
    computeFulfillmentCoursesAndStatistics(
      mockRequirement,
      [getMockCourseTaken(1), getMockCourseTaken(2), getMockCourseTaken(3), getMockCourseTaken(4)],
      {},
      {}
    )
  ).toEqual<StatisticsResultType>({
    courses: [
      [getMockCourseTaken(1), getMockCourseTaken(2)],
      [getMockCourseTaken(3)],
      [getMockCourseTaken(4)],
    ],
    fulfilledBy: 'courses',
    minCountFulfilled: 4,
    minCountRequired: 4,
  });

  // Same as above, but in different order. It shows the algorithm is order-sentitive.
  expect(
    computeFulfillmentCoursesAndStatistics(
      mockRequirement,
      [getMockCourseTaken(1), getMockCourseTaken(2), getMockCourseTaken(4), getMockCourseTaken(3)],
      {},
      {}
    )
  ).toEqual<StatisticsResultType>({
    courses: [
      [getMockCourseTaken(1), getMockCourseTaken(2)],
      [getMockCourseTaken(4)],
      [getMockCourseTaken(3)],
    ],
    fulfilledBy: 'courses',
    minCountFulfilled: 4,
    minCountRequired: 4,
  });
});

it('computeFulfillmentCoursesAndStatistics course (with additional requirements) test', () => {
  const mockRequirement: RequirementWithIDSourceType = {
    ...mockRequirementCommon,
    fulfilledBy: 'courses',
    perSlotMinCount: [2, 1, 1],
    slotNames: ['', '', ''],
    courses: [
      [1, 2],
      [3, 4],
      [3, 4],
    ],
    additionalRequirements: {
      R1: {
        fulfilledBy: 'courses',
        perSlotMinCount: [1, 1],
        slotNames: ['', ''],
        courses: [
          [1, 3],
          [2, 4],
        ],
      },
      R2: {
        fulfilledBy: 'courses',
        perSlotMinCount: [1, 1],
        slotNames: ['', ''],
        courses: [
          [1, 2],
          [4, 3],
        ],
      },
      R3: {
        fulfilledBy: 'credits',
        perSlotMinCount: [100],
        courses: [[1, 2, 4]],
      },
    },
  };

  // Asserts that the progress computation goes deeper into additional requirements,
  // when they are present.
  expect(
    computeFulfillmentCoursesAndStatistics(
      mockRequirement,
      [
        getMockCourseTaken(1, 1),
        getMockCourseTaken(2, 2),
        getMockCourseTaken(3, 3),
        getMockCourseTaken(4, 4),
      ],
      {},
      {}
    )
  ).toEqual<StatisticsResultType>({
    courses: [
      [getMockCourseTaken(1, 1), getMockCourseTaken(2, 2)],
      [getMockCourseTaken(3, 3)],
      [getMockCourseTaken(4, 4)],
    ],
    fulfilledBy: 'courses',
    minCountFulfilled: 4,
    minCountRequired: 4,
    additionalRequirements: {
      R1: {
        courses: [[getMockCourseTaken(1, 1)], [getMockCourseTaken(2, 2)]],
        fulfilledBy: 'courses',
        minCountFulfilled: 2,
        minCountRequired: 2,
      },
      R2: {
        courses: [[getMockCourseTaken(1, 1)], [getMockCourseTaken(3, 3)]],
        fulfilledBy: 'courses',
        minCountFulfilled: 2,
        minCountRequired: 2,
      },
      R3: {
        courses: [[getMockCourseTaken(1, 1), getMockCourseTaken(2, 2), getMockCourseTaken(4, 4)]],
        fulfilledBy: 'credits',
        minCountFulfilled: 7,
        minCountRequired: 100,
      },
    },
  });
});

it('computeFulfillmentCoursesAndStatistics course (with minNumberOfSlots) test', () => {
  const mockRequirement: RequirementWithIDSourceType = {
    ...mockRequirementCommon,
    fulfilledBy: 'courses',
    perSlotMinCount: [1, 1, 1, 1],
    slotNames: ['', '', '', ''],
    courses: [
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
    ],
    minNumberOfSlots: 3,
  };

  // Asserts that progress is correctly computed when minNumberOfSlots is computed.
  // Here we have an extra useless course 2, but it's not used to fill any slot as expected.
  expect(
    computeFulfillmentCoursesAndStatistics(
      mockRequirement,
      [getMockCourseTaken(1), getMockCourseTaken(2), getMockCourseTaken(3)],
      {},
      {}
    )
  ).toEqual<StatisticsResultType>({
    courses: [[getMockCourseTaken(1)], [getMockCourseTaken(3)], [], []],
    fulfilledBy: 'courses',
    minCountFulfilled: 2,
    minCountRequired: 3,
  });
});

it('computeFulfillmentCoursesAndStatistics toggleable requirement test', () => {
  const mockRequirement: RequirementWithIDSourceType = {
    ...mockRequirementCommon,
    fulfilledBy: 'toggleable',
    fulfillmentOptions: {
      A: {
        description: '',
        counting: 'courses',
        slotNames: [''],
        perSlotMinCount: [1],
        courses: [[1]],
      },
      B: {
        description: '',
        counting: 'courses',
        slotNames: [''],
        perSlotMinCount: [1],
        courses: [[2]],
      },
    },
  };

  // The following 3 tests ensures that we respects the user choice in toggleable requirements.
  // The first one has no choice so it defaults to the first option.
  // The second one chooses option A, and the third one chooses option B.
  expect(
    computeFulfillmentCoursesAndStatistics(mockRequirement, [getMockCourseTaken(1)], {}, {})
  ).toEqual<StatisticsResultType>({
    courses: [[getMockCourseTaken(1)]],
    fulfilledBy: 'courses',
    minCountFulfilled: 1,
    minCountRequired: 1,
  });
  expect(
    computeFulfillmentCoursesAndStatistics(
      mockRequirement,
      [getMockCourseTaken(1)],
      {
        MOCK_ID: 'A',
      },
      {}
    )
  ).toEqual<StatisticsResultType>({
    courses: [[getMockCourseTaken(1)]],
    fulfilledBy: 'courses',
    minCountFulfilled: 1,
    minCountRequired: 1,
  });
  expect(
    computeFulfillmentCoursesAndStatistics(
      mockRequirement,
      [getMockCourseTaken(1)],
      {
        MOCK_ID: 'B',
      },
      {}
    )
  ).toEqual<StatisticsResultType>({
    courses: [[]],
    fulfilledBy: 'courses',
    minCountFulfilled: 0,
    minCountRequired: 1,
  });
});
