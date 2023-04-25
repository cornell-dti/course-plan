import fs from 'fs';
import { semestersCollection } from './firebase-config';

function writeToCSV(userId: number, crseId: number, rating: number, timestamp: number) {
  const csv = `${userId},${crseId},${rating},${timestamp}\n`;
  try {
    fs.appendFileSync('src/rec-sys/ratings.csv', csv);
  } catch (err) {
    console.error(err);
  }
}

function getUserCourses(
  user: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
): number[] {
  const userCourseIDs: number[] = [];
  const semesters = user.get('semesters');
  for (const semester of semesters) {
    const { courses } = semester;
    for (const course of courses) {
      userCourseIDs.push(course.crseId);
    }
  }
  return userCourseIDs;
}

function createCSVHeaders() {
  const csv = 'userID,itemID,rating,timestamp\n';
  try {
    fs.appendFileSync('src/rec-sys/ratings.csv', csv);
  } catch (err) {
    console.error(err);
  }
}
const exportUserData = async () => {
  const userSnapshot = await semestersCollection.get();
  createCSVHeaders();
  let id = 0;
  for (const user of userSnapshot.docs) {
    const courses = getUserCourses(user);
    for (const course of courses) {
      if (course !== undefined) {
        writeToCSV(id, course, 1, 0);
      }
    }
    id += 1;
  }
};

exportUserData();
