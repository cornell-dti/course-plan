import { doc, getDoc } from 'firebase/firestore';
import { coursesCollection, availableRostersForCoursesCollection } from '../firebase-config';

export const getCourse = async (roster: string, subject: string, number: string) => {
  const course = await getDoc(doc(coursesCollection, `${roster}/${subject}/${number}`));
  if (!course.exists()) {
    const availableRostersForCourse = (
      await getDoc(doc(availableRostersForCoursesCollection, `${subject} ${number}`))
    ).data() as { rosters: string[] };
    const lastRoster = availableRostersForCourse.rosters.length - 1;
    const latestCourse = await getDoc(
      doc(
        coursesCollection,
        `${availableRostersForCourse.rosters[lastRoster]}/${subject}/${number}`
      )
    );
    return latestCourse.data()?.course;
  }
  return course.data()?.course;
};

export default getCourse;
