const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cornelldti-courseplan-dev.firebaseio.com',
});

const filteredAllCourses = Object.values(
  JSON.parse(fs.readFileSync('../src/assets/courses/full-courses.json').toString())
).flat();

const db = admin.firestore();
const userDataCollection = db.collection('userData');

const transformData = data => ({
  ...data,
  semesters: data.semesters.map(semester => ({
    ...semester,
    courses: semester.courses.map(course => {
      const { code } = course;
      const [subject, number] = code.split(' ');
      const fullCourse = filteredAllCourses.find(
        it => it.subject === subject && it.catalogNbr === number
      );
      const crseId = fullCourse && fullCourse.crseId;
      if (crseId == null) throw new Error(`user=${data.id}, subject=${subject}, number=${number}`);
      return { ...course, crseId };
    }),
  })),
});

if (process.argv[2] === '--dry-run') {
  userDataCollection.get().then(userData => {
    const oldUserData = userData.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const newUserData = oldUserData.map(transformData);
    fs.writeFileSync('old.json', JSON.stringify(oldUserData, undefined, 2));
    fs.writeFileSync('new.json', JSON.stringify(newUserData, undefined, 2));
  });
  return;
} else {
  userDataCollection.get().then(userData => {
    Promise.all(
      userData.docs.map(userDataDocument =>
        userDataDocument.ref.set(transformData(userDataDocument.data()))
      )
    );
  });
}
