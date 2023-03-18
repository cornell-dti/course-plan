export type Course = {
  /** Corresponds to the "prefix" column on the PDF */
  subject: string;
  /** Corresponds to the "code" column on the PDF */
  catalogNbr: number;
  /** The liberal studies categories satisfied by the course */
  categories: readonly string[];
};

// creates list of course entries
export function genCourseEntries(data) {
  const courseEntries: Course[] = [];
  let col = 'course prefix';
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
      if (col === 'course prefix' && v.length <= 5) {
        subject = v;
        col = 'course number';
      } else if (col === 'course number') {
        catalogNbr = parseInt(v, 10);
        col = 'course title';
      } else if (col === 'course title') {
        // title = v;
        col = 'college';
      } else if (col === 'college') {
        // college = v;
        col = 'category';
      } else if (col === 'category') {
        categories = v.split(', ');
        col = 'credits';
      } else if (col === 'credits') {
        // let creditList = v.split('-');
        // creditList = creditList.map((x: string) => parseInt(x, 10));
        // credits = creditList;
        col = 'course prefix';

        const course = { subject, catalogNbr, categories };
        courseEntries.push(course);
      }
    } catch {
      // If any data is invalid, exclude the Course from the result.
    }
  }
  return courseEntries.filter(course => !Number.isNaN(course.catalogNbr));
}
