/**
 * This script retrieves data from all courses from all available
 * class rosters and pushes them to the 'courses' collection in
 * Firebase.
 *
 *  Motivation for this script as well as the schema
 * for the 'courses' collection can be found here:
 * https://tinyurl.com/5n86j4p7
 */

/**
 * Initalization:
 * - Retrieve list of all available rosters
 *    - https://classes.cornell.edu/api/2.0/config/rosters.json
 * - Extract semester codes
 *    - response.data.map((roster) -> roster.slug)
 *
 * Subject Retrieval per Semester:
 * - Retrieve list of available subjects in a roster
 *    - https://classes.cornell.edu/api/2.0/config/subjects.json?roster=<SEM_CODE>
 * - Extract subject codes
 *    - response.data.subjects.map((subject) -> subject.value)
 *
 * Courses Retrieval per Subject:
 * - Retrieve list of available courses from each subject
 *    - https://classes.cornell.edu/api/2.0/search/classes.json?roster=<SEM_CODE>&subject=<SUB_ID>
 * - Extract relevant course data
 *    - response.data.classes.map((course) -> extractData(course))
 *    - Design and implement extractData function
 *
 * Core Logic:
 * - For semester in semesters:
 *       //create firestore document in 'courses' collection
 *       For subject in semester:
 *            //create firestore collection for 'subject' in 'semester' document
 *            subject_courses := available courses for a subject
 *            For course in subject_courses:
 *                //create firestore document for 'course' in 'subject'
 */
