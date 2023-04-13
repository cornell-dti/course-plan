import fs from 'fs';
import { semestersCollection } from './firebase-config';

<<<<<<< HEAD
function writeToRatingsCSV(userId: number, crseId: number, rating: number, timestamp: number) {
  const csv = `${userId},${crseId},${rating},${timestamp}\n`;
  try {
    fs.appendFileSync('src/rec-sys/ratings.csv', csv);
  } catch (err) {
    console.error(err);
=======
class Rating {
  userId: number;

  courseId: number;

  rating: number;

  timestamp: number;

  constructor(id: number, course: number, rating: 1, timestamp: 0) {
    this.userId = id;
    this.courseId = course;
    this.rating = rating;
    this.timestamp = timestamp;
  }
  saveAsCSV() {
    const csv = `${this.userId},${this.courseId},${this.rating},${this.timestamp}\n`;
    try {
      fs.appendFileSync('src/rec-sys/ratings.csv', csv);
    } catch (err) {
      console.error(err);
    }
>>>>>>> 21dc8df5 (added script to get user data)
  }
}

function getUserCourses(
  user: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
): number[] {
  let userCourseIDs: number[] = [];
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
