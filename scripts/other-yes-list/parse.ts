export type Course = {
  /** Corresponds to the "prefix" column on the PDF */
  subject: string;
  /** Corresponds to the "code" column on the PDF */
  catalogNbr: number;
  /** The liberal studies categories satisfied by the course */
  categories: readonly string[];
};

enum Col {
  CoursePrefix,
  CourseNumber,
  Title,
  College,
  Category,
  Credits
};

// creates list of course entries
export function genCourseEntries(data) {
  const courseEntries: Course[] = [];
  let c: Col= Col.CoursePrefix as Col;
  let subject = '';
  let catalogNbr = 0;
  let categories = [];

  // find the index of the first course (right after Notes)
  let start = 0;
  for (let i = 0; i < data.length; i += 1) {
    try {
      const v = data[i][0].str.trim();
      if (v.slice(0, 5) === 'Notes') {
        start = i + 1;
      }
    } catch {
      // in case there is no list of approved courses
    }
  }
  // assumes that the columns are ordered and there are no empty cells
  for (let i = start; i < data.length; i += 1) {
    try {
      const v = data[i][0].str.trim();
      switch (c) {
        case Col.CoursePrefix:
          if (v.length <= 5) {
          subject = v;
          c = Col.CourseNumber;
          }
          break;
        case Col.CourseNumber:
          catalogNbr = parseInt(v, 10);
          c = Col.Title;
          break;
        case Col.Title:
          // title = v;
          c = Col.College;
          break;
        case Col.College:
          // college = v;
          c = Col.Category;
          break;
        case Col.Category:
          categories = v.split(', ');
          c = Col.Credits;
          break;
        case Col.Credits: {
          // let creditList = v.split('-');
          // creditList = creditList.map((x: string) => parseInt(x, 10));
          // credits = creditList;
          const course = { subject, catalogNbr, categories };
          courseEntries.push(course);
          c = Col.CoursePrefix;
          break;
        }
        default:
          break;
      }
    } catch {
      // If any data is invalid, exclude the Course from the result.
    }
  }
  return courseEntries.filter(course => !Number.isNaN(course.catalogNbr));
}
