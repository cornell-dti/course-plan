import ScheduleGenerator from '../algorithm';
import Course, { DayOfTheWeek } from '../course-unit';
import GeneratorRequest from '../generator-request';
import Requirement from '../requirement';

const semester = '2026 Fall';
const reqA = new Requirement('Req A', 'College', 'CS');
const reqB = new Requirement('Req B', 'College', 'CS');
const reqC = new Requirement('Req C', 'College', 'CS');
const MWF: DayOfTheWeek[] = ['Monday', 'Wednesday', 'Friday'];
const TR: DayOfTheWeek[] = ['Tuesday', 'Thursday'];

const course = (code: string, days: DayOfTheWeek[], start: string, end: string, req: Requirement) =>
  new Course(code, '#000000', 4, [{ daysOfTheWeek: days, start, end }], [semester], [req]);

const codesOf = (classes: Course[], creditLimit = 20) =>
  Array.from(
    ScheduleGenerator.generateSchedule(
      new GeneratorRequest(classes, [], creditLimit, semester)
    ).schedule.keys()
  )
    .map(c => c.code)
    .sort();

const runs = 30;

describe('ScheduleGenerator.generateSchedule', () => {
  it('tries other sections of a course before dropping it', () => {
    const classes = [
      course('CS 1110', MWF, '10:00am', '11:00am', reqA),
      course('CS 2110', MWF, '10:00am', '11:00am', reqB),
      course('CS 2110', TR, '10:00am', '11:00am', reqB),
    ];
    for (let i = 0; i < runs; i += 1) {
      expect(codesOf(classes)).toEqual(['CS 1110', 'CS 2110']);
    }
  });

  it('picks the course that leaves room for other requirements', () => {
    const classes = [
      course('CS 1110', MWF, '10:00am', '11:00am', reqA),
      course('CS 1112', TR, '10:00am', '11:00am', reqA),
      course('MATH 1920', MWF, '10:00am', '11:00am', reqB),
    ];
    for (let i = 0; i < runs; i += 1) {
      expect(codesOf(classes)).toEqual(['CS 1112', 'MATH 1920']);
    }
  });

  it('fills each requirement once without reporting the unused alternatives', () => {
    const classes = [
      course('CS 1110', MWF, '8:00am', '9:00am', reqA),
      course('CS 1112', TR, '8:00am', '9:00am', reqA),
      course('MATH 1920', MWF, '1:00pm', '2:00pm', reqB),
    ];
    for (let i = 0; i < runs; i += 1) {
      const output = ScheduleGenerator.generateSchedule(
        new GeneratorRequest(classes, [], 20, semester)
      );
      expect(output.schedule.size).toBe(2);
      expect(output.unscheduledCourses).toEqual([]);
    }
  });

  it('reports courses left out by the credit limit', () => {
    const classes = [
      course('CS 1110', MWF, '8:00am', '9:00am', reqA),
      course('MATH 1920', TR, '8:00am', '9:00am', reqB),
      course('PHYS 1112', MWF, '1:00pm', '2:00pm', reqC),
    ];
    const output = ScheduleGenerator.generateSchedule(
      new GeneratorRequest(classes, [], 8, semester)
    );
    expect(output.schedule.size).toBe(2);
    expect(output.unscheduledCourses).toHaveLength(1);
    expect(output.unscheduledCourses[0].conflictsWith).toEqual([]);
  });

  it('still fills every course that fits when the search budget runs out', () => {
    const classes = [
      course('CS 1110', MWF, '8:00am', '9:00am', reqA),
      course('MATH 1920', TR, '8:00am', '9:00am', reqB),
      course('PHYS 1112', MWF, '1:00pm', '2:00pm', reqC),
    ];
    const output = ScheduleGenerator.generateSchedule(
      new GeneratorRequest(classes, [], 20, semester),
      0
    );
    expect(output.schedule.size).toBe(3);
    expect(output.totalCredits).toBe(12);
    expect(output.unscheduledCourses).toEqual([]);
  });

  it('names the scheduled course that an unfit course clashes with', () => {
    const classes = [
      course('CS 1110', MWF, '10:00am', '11:00am', reqA),
      course('MATH 1920', MWF, '10:30am', '11:30am', reqB),
    ];
    for (let i = 0; i < runs; i += 1) {
      const output = ScheduleGenerator.generateSchedule(
        new GeneratorRequest(classes, [], 20, semester)
      );
      const [scheduled] = Array.from(output.schedule.keys()).map(c => c.code);
      const other = scheduled === 'CS 1110' ? 'MATH 1920' : 'CS 1110';
      expect(output.unscheduledCourses).toEqual([{ code: other, conflictsWith: [scheduled] }]);
    }
  });
});
