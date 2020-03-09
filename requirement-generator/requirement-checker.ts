import { Course, RequirementSearch } from './types';

/**
 * @param courseName : name of the course (as a code)
 * @param code : code to check courseName (can contain * to denote any value)
 * @returns if a code matches the course name (CS 2110 and CS 2*** returns true, AEM 3110 and AEM 32** returns false)
 */
function ifCodeMatch(courseName: string, code: string): boolean {
  for (let i = 0; i < courseName.length; i += 1) {
    if (code[i] !== '*' && courseName[i] !== code[i]) return false;
  }
  return true;
}

/**
 * @param {string} subject : subject of course to check
 * @param {string} number : number of course to check
 * @returns if the course satisfies all-eligible query (not PE or 10XX course)
 */
function ifAllEligible(subject: string, number: string): boolean {
  return !ifCodeMatch(subject, 'PE') && !ifCodeMatch(number, '10**');
}

/**
 * @param courseInfo information of the course from API data
 * @param search the scope of search for the requirement (e.g all-eligible, code, catalogDistr)
 * @param includes the query for the search to satisfy requirement (e.g (MQR-AS), CS 2***)
 * @param excludes the query for the search that does not satisfy requirement (e.g (MQR-AS), CS 2***)
 * @returns whether the course fullfills the given requirement
 */
export default function checkIfCourseFulfilled(
  courseInfo: Course,
  search: readonly RequirementSearch[] | undefined,
  includes: readonly string[][],
  excludes: readonly string[][]
): boolean {
  // Check if search exists. False if not
  if (search !== undefined) {
    // Special search: if search code is all or self-check. Anything would work
    if (search.includes('all') || search.includes('self-check')) return true;
    // Special search: if search code is not PE or 10XX course
    if (search.includes('all-eligible')) { return ifAllEligible(courseInfo.subject, courseInfo.catalogNbr.toString()); }

    // Excludes is optional. If it exists, a match with search command returns false
    if (excludes) {
      for (const exclude of excludes) {
        for (const excludeOption of exclude) {
          // Special search: if course code matches code
          if (search.includes('code')) {
            if (ifCodeMatch(`${courseInfo.subject} ${courseInfo.catalogNbr}`, excludeOption)) { return false; }
            // Make sure courseInfo[search] is not null
          } else {
            // Loop through search (for search commands with multiple options)
            for (const singleSearch of search) {
              // @ts-ignore
              const courseProperty = courseInfo[singleSearch];
              if (courseProperty && courseProperty.includes(excludeOption)) { return false; }
            }
          }
        }
      }
    }

    // Includes is mandatory. Function will check for include match with search command
    for (const include of includes) {
      for (const includeOption of include) {
        // Special search: if course code matches code
        if (search.includes('code')) {
          if (ifCodeMatch(`${courseInfo.subject} ${courseInfo.catalogNbr}`, includeOption)) { return true; }
          // Make sure courseInfo[search] is not null
        } else {
          // Loop through search (for search commands with multiple options)
          for (const singleSearch of search) {
            // @ts-ignore
            const courseProperty = courseInfo[singleSearch];
            if (courseProperty && courseProperty.includes(includeOption)) { return true; }
          }
        }
      }
    }
  }

  return false;
}
