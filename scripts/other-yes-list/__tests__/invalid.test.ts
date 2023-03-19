import { genCourseEntries } from '../parse';

describe('Parse function', () => {
  test('It should test that invalid course code is excluded from the result', () => {
    const input = [
      [
        {
          str: 'ANTHR',
          dir: 'ltr',
          width: 18.329520000000002,
          height: 6.36,
          transform: [Array],
          fontName: 'g_d0_f1',
        },
      ],
      [
        {
          str: 'course code',
          dir: 'ltr',
          width: 12.96008,
          height: 6.36,
          transform: [Array],
          fontName: 'g_d0_f1',
        },
      ],
      [
        {
          str: 'Human Evolution: Genes, Behavior, and Fossil Record',
          dir: 'ltr',
          width: 137.41415999999998,
          height: 6.36,
          transform: [Array],
          fontName: 'g_d0_f1',
        },
      ],
      [
        {
          str: 'A&S',
          dir: 'ltr',
          width: 10.971,
          height: 6.36,
          transform: [Array],
          fontName: 'g_d0_f1',
        },
      ],
      [
        {
          str: 'SBA',
          dir: 'ltr',
          width: 10.03608,
          height: 6.36,
          transform: [Array],
          fontName: 'g_d0_f1',
        },
      ],
      [
        {
          str: '3',
          dir: 'ltr',
          width: 3.22452,
          height: 6.36,
          transform: [Array],
          fontName: 'g_d0_f1',
        },
      ],
    ];

    const output = [];

    expect(genCourseEntries(input)).toEqual(output);
  });
});
