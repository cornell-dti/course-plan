import { usernameCollection } from './firebase-config';

const main = async () => {
  const collection = await usernameCollection.get();
  for (const { id } of collection.docs) {
    console.log(id);
  }
};

main();