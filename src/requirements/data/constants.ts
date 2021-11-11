/** Course ID for special course that satisfies no requirements. */
export const NO_EQUIVALENT_COURSES_COURSE_ID = 10; // TODO @bshen rename to NO_FULFILLMENTS_COURSE_ID

/** @deprecated Course ID for special course that satisfies total academic credits requirement. */
export const CREDITS_COURSE_ID = 11;

/** @deprecated Course ID for special course that satisfies FWS requirement. */
export const FWS_COURSE_ID = 12;

/** List of special course IDs */
export const SPECIAL_COURSES = {
  NO_EQUIVALENT_COURSES: NO_EQUIVALENT_COURSES_COURSE_ID,
  CREDITS: CREDITS_COURSE_ID,
  FWS: FWS_COURSE_ID,
};

/** The real course ID of the course that fulfills swim test. */
export const SWIM_TEST_COURSE_ID = 350002;
