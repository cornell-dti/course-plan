import fs from 'fs';
import { semestersCollection } from './firebase-config';

class Rating {
  userId: number;

  courseId: number;

  rating: number;

  timestamp: number;

  constructor(id: number, course: number, rating: number, timestamp: number) {
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
        const rating = new Rating(id, course, 1, 0);
        rating.saveAsCSV();
      }
    }
    id += 1;
  }
};

exportUserData();
