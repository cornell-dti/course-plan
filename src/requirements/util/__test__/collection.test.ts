import { HashMap, HashSet } from '../collections';

it('HashMap tests', () => {
  const map = new HashMap<string, number>(s => `HASH___${s}`);

  map.set('1', 1);
  map.set('2', 2);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  map.forEach(() => {});

  expect(map.get('1')).toBe(1);
  expect(map.get('2')).toBe(2);
  expect(map.get('3')).toBeUndefined();
  expect(map.has('1')).toBeTruthy();
  expect(map.has('2')).toBeTruthy();
  expect(map.has('3')).toBeFalsy();
  expect(map.size).toBe(2);

  map.set('1', 3);
  expect(map.get('1')).toBe(3);
  expect(map.get('2')).toBe(2);
  expect(map.get('3')).toBeUndefined();
  expect(map.has('1')).toBeTruthy();
  expect(map.has('2')).toBeTruthy();
  expect(map.has('3')).toBeFalsy();
  expect(map.size).toBe(2);

  map.delete('1');
  expect(map.get('1')).toBeUndefined();
  expect(map.get('2')).toBe(2);
  expect(map.get('3')).toBeUndefined();
  expect(map.has('1')).toBeFalsy();
  expect(map.has('2')).toBeTruthy();
  expect(map.has('3')).toBeFalsy();
  expect(map.size).toBe(1);

  map.clear();
  expect(map.get('1')).toBeUndefined();
  expect(map.get('2')).toBeUndefined();
  expect(map.get('3')).toBeUndefined();
  expect(map.has('4')).toBeFalsy();
  expect(map.has('5')).toBeFalsy();
  expect(map.has('6')).toBeFalsy();
  expect(map.size).toBe(0);
  map.forEach(() => {
    throw new Error();
  });
});

it('HashSet tests', () => {
  const set = new HashSet<string>(s => `HASH___${s}`);

  set.add('1');
  set.add('2');

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  set.forEach(() => {});

  expect(set.has('1')).toBeTruthy();
  expect(set.has('2')).toBeTruthy();
  expect(set.has('3')).toBeFalsy();
  expect(set.size).toBe(2);

  set.add('1');
  expect(set.has('1')).toBeTruthy();
  expect(set.has('2')).toBeTruthy();
  expect(set.has('3')).toBeFalsy();
  expect(set.size).toBe(2);

  set.delete('1');
  expect(set.has('1')).toBeFalsy();
  expect(set.has('2')).toBeTruthy();
  expect(set.has('3')).toBeFalsy();
  expect(set.size).toBe(1);

  set.clear();
  expect(set.has('1')).toBeFalsy();
  expect(set.has('2')).toBeFalsy();
  expect(set.has('3')).toBeFalsy();
  expect(set.size).toBe(0);
  set.forEach(() => {
    throw new Error();
  });
});
