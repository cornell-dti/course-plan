import { clean } from "../util";

describe('Courses Populate Test Suite', () => {
  it('Primitives and strings w/o NBS unchanged', () => {
    expect(clean(5)).toBe(5);
    expect(clean(null)).toBe(null);
    expect(clean(undefined)).toBe(undefined);
    expect(clean('hello')).toBe('hello');
  })

  it('String with NBS cleaned', () => {
    expect(clean('\u00a0')).toBe(' ');
    expect(clean('\u00a0\u00a0')).toBe('  ');
    expect(clean('\u00a0a\u00a0')).toBe(' a ');
  })

  it('Array with NBS cleaned', () => {
    expect(clean(['hi', '\u00a0', 'goodbye'])).toEqual(['hi', ' ', 'goodbye']);
  })

  it('Object with NBS cleansed', () => {
    const dirty = {
      foo: '\u00a0',
      foos: ['hello', '\u00a0', '\u00a0', 'goodbye'],
      bar: {
        baz: '\u00a0',
        buzz: 'farewell'
      }
    };
    const cleansed = clean(dirty);
    expect(cleansed).toEqual({
      foo: ' ',
      foos: ['hello', ' ', ' ', 'goodbye'],
      bar: {
        baz: ' ',
        buzz: 'farewell'
      }
    });
  });
});
