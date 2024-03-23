import { isPlaceholderCourse, isCourseTaken } from '../../utilities';
import { getCollegeAbbrev, getMajorAbbrev, getMinorAbbrev, getGradAbbrev } from '../../data';
import store from '../../store';
import { pdfColors } from '@/assets/constants/colors';
import { SemesterRows, BubbleData, ReqInfo } from './types';

export const trimEmptySems = (sems: readonly FirestoreSemester[]): readonly FirestoreSemester[] => {
  let maxNonemptyIndex = -1;
  for (let i = 0; i < sems.length; i += 1) {
    if (sems[i].courses.length > 0) maxNonemptyIndex = i;
  }
  return sems.slice(0, maxNonemptyIndex + 1);
};

/**
 * List of requirements to not display in the PDF.
 * We filter these out because they apply to almost every course, and make the
 * PDF somewhat messy.
 */
const reqsToFilterOut = ['A&S Credits'];

export const getCourseRows = (
  courses: readonly (FirestoreSemesterCourse | FirestoreSemesterPlaceholder | CourseTaken)[]
): SemesterRows => {
  const rows: [string[], BubbleData[]][] = courses
    .filter(
      (course): course is FirestoreSemesterCourse | CourseTaken => !isPlaceholderCourse(course)
    )
    .map(course => {
      const [reqs, bubbles] = getFulfilledReqs(course);
      return [
        [
          `${course.code}${isCourseTaken(course) ? '' : `: ${course.name}`}`,
          course.credits.toString(),
          reqs.join('\n'),
        ],
        bubbles,
      ];
    });
  return { body: rows.map(row => row[0]), bubbles: rows.map(row => row[1]) };
};

const getBubbleText = (req: string): string => {
  switch (store.state.userRequirementsMap[req].sourceType) {
    case 'College': {
      return getCollegeAbbrev(store.state.userRequirementsMap[req].sourceSpecificName);
    }
    case 'Grad':
      return getGradAbbrev(store.state.userRequirementsMap[req].sourceSpecificName);
    case 'Major': {
      return getMajorAbbrev(store.state.userRequirementsMap[req].sourceSpecificName);
    }
    case 'Minor': {
      return getMinorAbbrev(store.state.userRequirementsMap[req].sourceSpecificName);
    }
    default:
      throw new Error('group type not valid for bubble');
  }
};

/**
 * Maps from requirement groups to the appropriate colored bubble
 */
export const bubbleColorMap: Record<RequirementGroupType, (req?: string) => string> = {
  College: (req?: string) =>
    req && store.state.userRequirementsMap[req].sourceSpecificName === 'UNI'
      ? pdfColors.turquoise
      : pdfColors.collegeBlue,
  Grad: () => pdfColors.majorTeal,
  Major: () => pdfColors.majorTeal,
  Minor: () => pdfColors.minorDarkTeal,
};

const forcedBubbleColorMap = (req: 'College' | 'Major' | 'Minor' | 'Grad' | 'Uni'): string => {
  switch (req) {
    case 'College':
      return pdfColors.collegeBlue;
    case 'Grad':
      return pdfColors.majorTeal;
    case 'Major':
      return pdfColors.majorTeal;
    case 'Minor':
      return pdfColors.minorDarkTeal;
    default:
      return pdfColors.turquoise;
  }
};

export const getCourseRowsWithForcedReqs = (
  courses: Map<ReqInfo, FirestoreSemesterCourse>
): SemesterRows => {
  const rows: [string[], BubbleData[]][] = Array.from(courses.entries()).map(([req, course]) => {
    const reqs = [req.name];
    const bubbles = [{ requirementGroup: req.typeValue, color: forcedBubbleColorMap(req.type) }];
    return [
      [
        `${course.code}${isCourseTaken(course) ? '' : `: ${course.name}`}`,
        course.credits.toString(),
        reqs.join('\n'),
      ],
      bubbles,
    ];
  });
  return { body: rows.map(row => row[0]), bubbles: rows.map(row => row[1]) };
};

export const getFulfilledReqs = (
  course: FirestoreSemesterCourse | CourseTaken
): readonly [string[], BubbleData[]] => {
  const reqsFulfilled = store.state.safeRequirementFulfillmentGraph
    .getConnectedRequirementsFromCourse({
      uniqueId: isCourseTaken(course) ? course.uniqueId : course.uniqueID,
    })
    .filter(req => req in store.state.userRequirementsMap)
    .filter(req => !reqsToFilterOut.includes(store.state.userRequirementsMap[req].name));

  return [
    reqsFulfilled.map(req => store.state.userRequirementsMap[req].name),
    reqsFulfilled.map(req => ({
      requirementGroup: getBubbleText(req),
      color: bubbleColorMap[store.state.userRequirementsMap[req].sourceType](req),
    })),
  ];
};

/**
 * Asynchronously load an image
 *
 * @param src the source URL of the image to load
 * @returns a promise wrapping the loaded image
 */
export const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = err => reject(err);
  });
