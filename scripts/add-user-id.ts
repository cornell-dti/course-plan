/* eslint-disable no-await-in-loop */
import { semestersCollection } from './firebase-config';

const addUserId = async () => {
  const userSnapshot = await semestersCollection.get();
  let userIdIncrementer = 0;

  for (const user of userSnapshot.docs) {
    await semestersCollection.doc(user.id).update({ id: userIdIncrementer });
    userIdIncrementer += 1;
  }
};

addUserId();
