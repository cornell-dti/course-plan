import { doc, setDoc } from 'firebase/firestore';

import { usernameCollection } from '../firebase-config';
import store from '../store';

const setUsernameData = (name: FirestoreUserName): void => {
  setDoc(doc(usernameCollection, store.state.currentFirebaseUser.email), {
    firstName: name.firstName,
    middleName: name.middleName || '',
    lastName: name.lastName,
  });
};

export default setUsernameData;
