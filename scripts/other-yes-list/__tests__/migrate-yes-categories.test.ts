import { mockFirebase } from 'firestore-jest-mock';
import { mockCollection, mockDoc } from 'firestore-jest-mock/mocks/firestore';
import populateYesCategories from '../migrate-yes-categories';

mockFirebase({
  database: {
    courses: [{ id: 'SP23', _collection: [{ subject: 'ART', catalogNbr: 1500 }] }],
  },
});

test('test add a yes course', () => {
  const collection = mockCollection();

  populateYesCategories();

  return collection
    .doc('SP23')
    .collection('ART')
    .doc('1500')
    .get()
    .then(courseDoc => {
      expect(mockDoc).toHaveBeenCalledWith('SP23');
      expect(mockCollection).toHaveBeenCalledWith('ART');
      expect(mockDoc).toHaveBeenCalledWith('1500');
      expect(courseDoc.yesCategories).toEqual(['LA']);
    });
});
