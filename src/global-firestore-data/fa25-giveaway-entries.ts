import { doc, setDoc } from 'firebase/firestore';

import { fa25giveawayCollection } from '../firebase-config';

const enterGiveaway = async (netid: string, igUsername: string): Promise<void> => {
  await setDoc(doc(fa25giveawayCollection, netid), {
    igUsername,
  });
};

export default enterGiveaway;
