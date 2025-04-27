/* eslint-disable no-console */
import { usernameCollection, semestersCollection } from '../firebase-config';

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

    console.log('semestersDoc', semestersDoc.data());

    const data = semestersDoc.data();
    if (!data || !data.semesters) {
      console.log(`No semesters data found for user: ${userEmail}`);
      return;
    }

    const { plans: plansData } = data;
    if (plansData == null) {
      console.log(`No semesters data found for user: ${userEmail}`);
      return;
    }

    // check the data type of semestersData

    if (Array.isArray(plansData)) {
      console.log(`Semesters data is an array for user: ${userEmail}`);
      // return;
    }

    console.log('plan data:', plansData);
    // check the data type of each course in semestersData

    for (const plan of plansData) {
      const planSemesters = plan.semesters;
      console.log('semestersData', planSemesters);

      for (const semester of planSemesters) {
        console.log('semester', semester);
        for (const course of semester.courses) {
          console.log('course', course);
          if ('type' in course) {
            // remove the type field from course
            console.log(`Removing type from course ${course.name}`);
            delete course.type;
          }
        }
      }
    }

    // Update the Firestore document with the rolled-back data
    await semestersCollection.doc(userEmail).update({ plans: plansData });
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
