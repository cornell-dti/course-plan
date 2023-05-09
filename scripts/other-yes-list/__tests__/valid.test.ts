import { Course, genCourseEntries } from '../parse';

describe('Parse function', () => {
  test('It should test that valid data is parsed into the corresponding Course[]', () => {
    const input = [
      [
        {
          str: "Notes (e.g., cross-listed equivalents, former course #'s)",
          dir: 'ltr',
          width: 157.51871999999997,
          height: 6.96,
          transform: [6.96, 0, 0, 6.96, 520.39, 497.14],
          fontName: 'g_d0_f2',
        },
      ],
      [
        {
          str: 'ANSC',
          dir: 'ltr',
          width: 15.473880000000001,
          height: 6.36,
          transform: [Array],
          fontName: 'g_d0_f1',
        },
      ],
      [
        {
          str: '4140',
          dir: 'ltr',
          width: 12.96008,
          height: 6.36,
          transform: [Array],
          fontName: 'g_d0_f1',
        },
      ],
      [
        {
          str: 'Ethics and Animal Science',
          dir: 'ltr',
          width: 66.44928000000002,
          height: 6.36,
          transform: [Array],
          fontName: 'g_d0_f1',
        },
      ],
      [
        {
          str: 'CALS',
          dir: 'ltr',
          width: 12.63096,
          height: 6.36,
          transform: [Array],
          fontName: 'g_d0_f1',
        },
      ],
      [
        {
          str: 'KCM',
          dir: 'ltr',
          width: 12.1476,
          height: 6.36,
          transform: [Array],
          fontName: 'g_d0_f1',
        },
      ],
      [
        {
          str: '2',
          dir: 'ltr',
          width: 3.22452,
          height: 6.36,
          transform: [Array],
          fontName: 'g_d0_f1',
        },
      ],
      [
        {
          str: 'SP 2019',
          dir: 'ltr',
          width: 20.4792,
          height: 6.36,
          transform: [Array],
          fontName: 'g_d0_f1',
        },
      ],
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
          str: '1300',
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
      [
        {
          str: 'SP 2015',
          dir: 'ltr',
          width: 20.4792,
          height: 6.36,
          transform: [Array],
          fontName: 'g_d0_f1',
        },
      ],
      [
        {
          str: 'ARAB',
          dir: 'ltr',
          width: 15.81096,
          height: 6.36,
          transform: [Array],
          fontName: 'g_d0_f1',
        },
      ],
      [
        {
          str: '1201',
          dir: 'ltr',
          width: 12.96008,
          height: 6.36,
          transform: [Array],
          fontName: 'g_d0_f1',
        },
      ],
      [
        {
          str: 'Elementary Arabic I',
          dir: 'ltr',
          width: 50.180400000000006,
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
          str: 'FL',
          dir: 'ltr',
          width: 5.512040000000001,
          height: 6.36,
          transform: [Array],
          fontName: 'g_d0_f1',
        },
      ],
      [
        {
          str: '4',
          dir: 'ltr',
          width: 3.22452,
          height: 6.36,
          transform: [Array],
          fontName: 'g_d0_f1',
        },
      ],
    ];

    const output: Course[] = [
      {
        subject: 'ANSC',
        catalogNbr: 4140,
        categories: ['KCM'],
      },
      {
        subject: 'ANTHR',
        catalogNbr: 1300,
        categories: ['SBA'],
      },
      {
        subject: 'ARAB',
        catalogNbr: 1201,
        categories: ['FL'],
      },
    ];
    expect(genCourseEntries(input)).toEqual(output);
  });
});
