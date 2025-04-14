/* eslint-disable no-console */
import { usernameCollection, semestersCollection } from '../firebase-config';

/**
 * Removes the `type` field from a course object.
 * @param course - The course object to rollback.
 * @returns The rolled-back course object.
 */
function rollbackCourseType(course: any): any {
  const { type, ...rest } = course; // Remove the `type` field
  return rest;
}

/**
 * Runs the rollback for a specific user.
 * @param userEmail - The email of the user whose data is being rolled back.
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
      const updatedCourses = semester.courses.map((course: any) => rollbackCourseType(course));
      return {
        ...semester,
        courses: updatedCourses,
      };
    });

    // Update the Firestore document with the rolled-back data
    await semestersCollection.doc(userEmail).update({ semesters: updatedSemesters });
    console.log(`Rollback completed for user: ${userEmail}`);
  } catch (error) {
    console.error(`Failed to rollback data for user: ${userEmail}`, error);
  }
}

/**
 * Main rollback function.
 */
async function main() {
  const userEmail = process.argv[2];
  if (userEmail) {
    // Run rollback for a single user
    console.log(`Running rollback for user: ${userEmail}`);
    await runOnUser(userEmail);
  } else {
    const collection = await usernameCollection.get();
    for (const { id } of collection.docs) {
      console.group(`Rolling back for ${id}...`);
      // Intentionally await in a loop to have no interleaved console logs.
      // eslint-disable-next-line no-await-in-loop
      await runOnUser(id);
      console.groupEnd();
    }
  }
}

main().catch(error => {
  console.error('Rollback failed:', error);
});
