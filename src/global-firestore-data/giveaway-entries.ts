import { doc, setDoc } from 'firebase/firestore';

import { giveawayCollection } from '../firebase-config';

const enterGiveaway = (netid: string, igUsername: string): void => {
  setDoc(doc(giveawayCollection, netid), { igUsername });
};

export default enterGiveaway;
