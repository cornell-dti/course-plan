import { usernameCollection } from '../firebase-frontend-config';
import store from '../store';

const setUsernameData = (name: FirestoreUserName): void => {
  usernameCollection.doc(store.state.currentFirebaseUser.email).set({
    firstName: name.firstName,
    middleName: name.middleName || '',
    lastName: name.lastName,
  });
};

export default setUsernameData;
