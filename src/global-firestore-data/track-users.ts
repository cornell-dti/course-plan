import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';

import { db } from '../firebase-config';

type AnalyticsData = {
  readonly data: string;
  readonly timestamp: string;
};

const trackUsersRef = collection(db, 'track-users');

// const retrieveAnalytics = (): Promise<AnalyticsData> =>
//   getDocs(query(trackUsersRef, orderBy('timestamp', 'desc'), limit(1))).then(querySnapshot => {
//     let newestDocData = {};
//     let newestDocDate = new Date(0);
//     querySnapshot.forEach(doc => {
//       const isoTimestamp = doc.id;
//       const date = new Date(isoTimestamp);
//       if (date.getTime() > newestDocDate.getTime()) {
//         newestDocDate = date;
//         newestDocData = doc.data();
//       }
//     });

//     const output = JSON.stringify(newestDocData, null, 2);

//     return {
//       data: output,
//       timestamp: newestDocDate.toLocaleString(),
//     };
//   });
const retrieveAnalytics = async (): Promise<AnalyticsData> => {
  const querySnapshot = await getDocs(query(trackUsersRef, orderBy('timestamp', 'desc'), limit(1)));
  console.log(
    'Fetched documents:',
    querySnapshot.docs.map(doc => doc.data())
  );

  let newestDocData = {};
  let newestDocDate = new Date(0);
  querySnapshot.forEach(doc => {
    console.log('Processing document:', doc.id, doc.data());
    const data = doc.data();
    const isoTimestamp = data.timestamp || doc.id; // Fallback to doc.id
    const date = new Date(isoTimestamp);
    if (date.getTime() > newestDocDate.getTime()) {
      newestDocDate = date;
      newestDocData = data;
    }
  });

  const output = JSON.stringify(newestDocData, null, 2);

  return {
    data: output,
    timestamp: newestDocDate.toLocaleString(),
  };
};

export default retrieveAnalytics;
