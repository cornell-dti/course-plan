import { mockCollection, mockDoc } from 'firestore-jest-mock/mocks/firestore';

test('testing stuff', () => {
  const collection = mockCollection();

  return collection
    .doc('SP23')
    .collection('ART')
    .doc('1500')
    .get()
    .then(courseDoc => {
      expect(mockDoc).toHaveBeenCalledWith('SP23');
      expect(mockCollection).toHaveBeenCalledWith('ART');
      expect(mockDoc).toHaveBeenCalledWith('1500');
      expect(courseDoc.yesCategories === ['LA']);
    });
});