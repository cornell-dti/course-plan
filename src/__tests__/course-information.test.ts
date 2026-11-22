import { getCourse } from '../global-firestore-data/courses';
import {
  COURSE_PREVIEW_ID,
  courseToSearchPreview,
  loadCourseDetails,
  loadCourseReviews,
} from '../course-information';

jest.mock('../global-firestore-data/courses', () => ({ getCourse: jest.fn() }));

const course: CornellCourseRosterCourseFullDetail = {
  crseId: 123,
  subject: 'CS',
  catalogNbr: '4160',
  titleLong: 'Formal Verification',
  roster: 'SP26',
  acadCareer: 'UG',
  acadGroup: 'AS',
  catalogWhenOffered: 'Fall, Spring.',
  catalogDistr: '(SMR-AS)',
  description: 'An introduction to formal verification.',
  enrollGroups: [
    {
      unitsMinimum: 3,
      unitsMaximum: 4,
      classSections: [
        {
          ssrComponent: 'LEC',
          meetings: [
            {
              pattern: 'TR',
              timeStart: '02:55PM',
              timeEnd: '04:10PM',
              instructors: [{ netid: 'mrc26', firstName: 'Michael', lastName: 'Clarkson' }],
            },
          ],
        },
      ],
    },
  ],
};

const fetchMock = jest.spyOn(globalThis, 'fetch');
const getCourseMock = getCourse as jest.Mock;

beforeEach(() => {
  jest.resetAllMocks();
  getCourseMock.mockResolvedValue(course);
});

afterAll(() => fetchMock.mockRestore());

it('requests the selected roster and uses the fallback roster returned by getCourse', async () => {
  const result = await loadCourseDetails('FA26', 'CS', '4160');
  expect(getCourseMock).toHaveBeenCalledWith('FA26', 'CS', '4160');
  expect(result).toEqual({
    roster: 'SP26',
    information: {
      description: course.description,
      prereqs: '',
      enrollment: ['LEC'],
      lectureTimes: ['TR 02:55PM - 04:10PM'],
      instructors: ['Michael Clarkson (mrc26)'],
      distributions: ['SMR-AS'],
    },
  });
  const preview = courseToSearchPreview({ ...course, roster: 'FA26' }, '123456');
  Object.assign(preview, result.information, { currRoster: result.roster });
  expect(preview.currRoster).toBe('SP26');
});

it('converts missing detail fields to the existing empty information presentation', async () => {
  getCourseMock.mockResolvedValue({
    ...course,
    description: undefined,
    enrollGroups: undefined,
    catalogDistr: undefined,
  });
  expect((await loadCourseDetails('SP26', 'CS', '4160')).information).toEqual({
    description: '',
    prereqs: '',
    enrollment: [],
    lectureTimes: [],
    instructors: [],
    distributions: [''],
  });
});

it('handles detail records without section or meeting information', async () => {
  getCourseMock.mockResolvedValue({
    ...course,
    enrollGroups: [{ unitsMinimum: 4, unitsMaximum: 4 }],
  });
  expect((await loadCourseDetails('SP26', 'CS', '4160')).information.instructors).toEqual([]);
});

it('propagates failed or unavailable course requests for retry', async () => {
  getCourseMock.mockRejectedValueOnce(new Error('offline'));
  await expect(loadCourseDetails('SP26', 'CS', '4160')).rejects.toThrow('offline');
  getCourseMock.mockResolvedValueOnce(undefined);
  await expect(loadCourseDetails('SP26', 'CS', '4160')).rejects.toThrow('unavailable');
});

it('creates a transient course using the search metadata, subject color, and a local sentinel', () => {
  const preview = courseToSearchPreview(course, '123456');
  expect(preview).toMatchObject({
    uniqueID: COURSE_PREVIEW_ID,
    code: 'CS 4160',
    name: 'Formal Verification',
    credits: 4,
    color: '123456',
    currRoster: 'SP26',
    semesters: ['Fall', 'Spring'],
    overallRating: 0,
  });
  expect(courseToSearchPreview(course, 'ffffff').uniqueID).toBe(preview.uniqueID);
  expect(course).not.toHaveProperty('uniqueID');
  expect(getCourseMock).not.toHaveBeenCalled();
});

it('keeps preview metadata available without credits or offering information', () => {
  expect(
    courseToSearchPreview(
      { ...course, enrollGroups: [], catalogWhenOffered: null, catalogDistr: undefined },
      '123456'
    )
  ).toMatchObject({ credits: 0, semesters: [], distributions: [''], name: course.titleLong });
});

it('keeps distribution information from search metadata before detail requests finish', () => {
  expect(courseToSearchPreview(course, '123456').distributions).toEqual(['SMR-AS']);
});

it('loads reviews separately and converts ratings for BottomBarCourse', async () => {
  fetchMock.mockResolvedValue(
    new Response(
      JSON.stringify({
        result: { classRating: 4.5, classDifficulty: 2.3, classWorkload: 3 },
      })
    )
  );
  await expect(loadCourseReviews('CS', '4160')).resolves.toEqual({
    overallRating: 4.5,
    difficulty: 2.3,
    workload: 3,
  });
  expect(fetchMock).toHaveBeenCalledWith('https://www.cureviews.org/api/courses/get-by-info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject: 'cs', number: '4160' }),
  });
  expect(getCourseMock).not.toHaveBeenCalled();
});

it.each([null, {}, { classRating: null, classDifficulty: null, classWorkload: null }])(
  'uses the existing N/A values when reviews are missing: %j',
  async result => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ result })));
    await expect(loadCourseReviews('CS', '4160')).resolves.toEqual({
      overallRating: 0,
      difficulty: 0,
      workload: 0,
    });
  }
);

it('treats a missing review course as N/A', async () => {
  fetchMock.mockResolvedValue(new Response('', { status: 404 }));
  await expect(loadCourseReviews('CS', '4160')).resolves.toEqual({
    overallRating: 0,
    difficulty: 0,
    workload: 0,
  });
});

it('uses N/A when the reviews service returns a null response body', async () => {
  fetchMock.mockResolvedValue(new Response('null'));
  await expect(loadCourseReviews('CS', '4160')).resolves.toEqual({
    overallRating: 0,
    difficulty: 0,
    workload: 0,
  });
});

it('propagates review network, server, and malformed-response errors for retry', async () => {
  fetchMock.mockRejectedValueOnce(new Error('offline'));
  await expect(loadCourseReviews('CS', '4160')).rejects.toThrow('offline');
  fetchMock.mockResolvedValueOnce(new Response('', { status: 503 }));
  await expect(loadCourseReviews('CS', '4160')).rejects.toThrow('unavailable');
  fetchMock.mockResolvedValueOnce(new Response('not json'));
  await expect(loadCourseReviews('CS', '4160')).rejects.toThrow();
});
