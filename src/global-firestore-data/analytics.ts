import { trackUsersCollection } from '../firebase-frontend-config';

type AnalyticsData = {
  readonly data: string;
  readonly timestamp: string;
};

const retrieveAnalytics = (): Promise<AnalyticsData> =>
  trackUsersCollection
    .orderBy('timestamp', 'desc')
    .limit(1)
    .get()
    .then(querySnapshot => {
      let newestDocData = {};
      let newestDocDate = new Date(0);
      querySnapshot.forEach(doc => {
        const isoTimestamp = doc.id;
        const date = new Date(isoTimestamp);
        if (date.getTime() > newestDocDate.getTime()) {
          newestDocDate = date;
          newestDocData = doc.data();
        }
      });

      const output = JSON.stringify(newestDocData, null, 2);

      return {
        data: output,
        timestamp: newestDocDate.toLocaleString(),
      };
    });

export default retrieveAnalytics;
