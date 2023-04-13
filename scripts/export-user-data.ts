import fs from 'fs';
import { semestersCollection } from './firebase-config';

function writeToRatingsCSV(userId: number, crseId: number, rating: number, timestamp: number) {
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
  for (const { courses } of semesters) {
    for (const { crseId } of courses) {
      userCourseIDs.push(crseId);
    }
  }
  return userCourseIDs;
}

function createRatingsCSVHeaders() {
  const csv = 'userID,itemID,rating,timestamp\n';
  try {
    fs.appendFileSync('src/rec-sys/ratings.csv', csv);
  } catch (err) {
    console.error(err);
  }
}

const exportUserData = async () => {
  const userSnapshot = await semestersCollection.get();
  createRatingsCSVHeaders();
  let id = 0;
  for (const user of userSnapshot.docs) {
    await semestersCollection.doc(user.id).update({ id: id });
    const courses = getUserCourses(user);
    for (const course of courses) {
      if (course !== undefined) {
        writeToRatingsCSV(id, course, 1, 0);
      }
    }
    id += 1;
  }
};

exportUserData();
