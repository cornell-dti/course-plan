/* eslint-disable no-console */
import { usernameCollection, semestersCollection } from '../firebase-config';

/**
 * Updates a course to include the `type` field and migrate it to either
 * `FirestoreSemesterCornellCourse` or `FirestoreSemesterBlankCourse`.
 * Note: There is no blank coures yet on Courseplan so by default all courses are Cornell courses.
 * @param course - The course object to migrate.
 * @returns The migrated course object.
 */
function migrateCourseType(course: any): any {
  if ('crseId' in course) {
    // It's a Cornell course
    return {
      ...course,
      type: 'CornellCourse', // Add the type field
    };
  }
  // None of the courses right now on Courseplan are blank courses
  console.warn(`Unknown course type for course: ${JSON.stringify(course)}`);
  return course; // Return the course unchanged if it doesn't match any known type
}

/**
 * Runs the migration for a specific user.
 * @param userEmail - The email of the user whose data is being migrated.
 */
async function runOnUser(userEmail: string) {
  try {
    const semestersDoc = await semestersCollection.doc(userEmail).get();
    if (!semestersDoc.exists) {
      console.log(`No semesters found for user: ${userEmail}`);
      return;
    }

    const data = semestersDoc.data();
    if (!data || !data.semesters) {
      console.log(`No semesters data found for user: ${userEmail}`);
      return;
    }

    const updatedSemesters = data.semesters.map((semester: any) => {
      const updatedCourses = semester.courses.map((course: any) => migrateCourseType(course));
      return {
        ...semester,
        courses: updatedCourses,
      };
    });

    // Update the Firestore document with the migrated data
    await semestersCollection.doc(userEmail).update({ semesters: updatedSemesters });
    console.log(`Migration completed for user: ${userEmail}`);
  } catch (error) {
    console.error(`Failed to migrate data for user: ${userEmail}`, error);
  }
}

/**
 * Main migration function.
 */
async function main() {
  const userEmail = process.argv[2];
  if (userEmail) {
    // Run migration for a single user
    console.log(`Running migration for user: ${userEmail}`);
    await runOnUser(userEmail);
  } else {
    const collection = await usernameCollection.get();
    for (const { id } of collection.docs) {
      console.group(`Running on ${id}...`);
      // Intentionally await in a loop to have no interleaved console logs.
      // eslint-disable-next-line no-await-in-loop
      await runOnUser(id);
      console.groupEnd();
    }
  }
}

main().catch(error => {
  // added a error block
  console.error('Migration failed:', error);
});
