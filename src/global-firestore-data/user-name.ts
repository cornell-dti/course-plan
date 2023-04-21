import { doc, setDoc } from 'firebase/firestore';

import { usernameCollection } from '../firebase-config';
import store from '../store';

const setUsernameData = async (name: FirestoreUserName): Promise<void> => {
  await setDoc(doc(usernameCollection, store.state.currentFirebaseUser.email), {
    firstName: name.firstName,
    middleName: name.middleName || '',
    lastName: name.lastName,
  });
};

export default setUsernameData;
