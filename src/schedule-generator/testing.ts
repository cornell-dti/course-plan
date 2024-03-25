import Requirement from './requirement';
import Course from './course-unit';
import GeneratorRequest from './generator-request';
import ScheduleGenerator from './algorithm';

class Testing {
  public static main(): void {
    // Create some requirements
    const techElective = new Requirement('Technical Elective');
    const engrdReq = new Requirement('ENGRD Requirement');
    const probabilityReq = new Requirement('Probability Requirement');
    const coreClass = new Requirement('Core Class');

    // Courses
    const cs1110 = new Course(
      'CS1110',
      3,
      [
        {
          daysOfTheWeek: ['Monday', 'Wednesday'],
          start: '10:00 AM',
          end: '11:30 AM',
        },
      ],
      ['Fall', 'Spring'],
      [coreClass, techElective]
    );

    const orie3300 = new Course(
      'ORIE3300',
      4,
      [
        {
          daysOfTheWeek: ['Tuesday', 'Thursday'],
          start: '11:30 AM',
          end: '1:00 PM',
        },
        {
          daysOfTheWeek: ['Friday'],
          start: '3:00 PM',
          end: '5:30 PM',
        },
      ],
      ['Fall', 'Spring'],
      [coreClass, techElective]
    );

    const info4430 = new Course(
      'INFO4430',
      3,
      [
        {
          daysOfTheWeek: ['Monday', 'Wednesday'],
          start: '10:00 AM',
          end: '11:30 AM',
        },
        {
          daysOfTheWeek: ['Thursday'],
          start: '11:30 AM',
          end: '1:00 PM',
        },
      ],
      ['Fall'],
      [techElective]
    );

    const engrd2700 = new Course(
      'ENGRD2700',
      3,
      [
        {
          daysOfTheWeek: ['Tuesday', 'Thursday'],
          start: '12:20 PM',
          end: '1:10 PM',
        },
        {
          daysOfTheWeek: ['Monday', 'Friday'],
          start: '2:30 PM',
          end: '4:30 PM',
        },
      ],
      ['Fall', 'Spring'],
      [engrdReq, probabilityReq]
    );

    const additionalCourse1 = new Course(
      'XYZ123',
      3,
      [
        {
          daysOfTheWeek: ['Sunday'],
          start: '7:00 AM',
          end: '11:00 AM',
        },
      ],
      ['Fall', 'Spring'],
      [coreClass]
    );

    const additionalCourse2 = new Course(
      'ABC456',
      4,
      [
        {
          daysOfTheWeek: ['Monday', 'Saturday'],
          start: '4:30 PM',
          end: '6:00 PM',
        },
      ],
      ['Spring'],
      [techElective]
    );

    const randomCourse1 = new Course(
      'XYZ789',
      3,
      [
        {
          daysOfTheWeek: ['Tuesday'],
          start: '1:00 PM',
          end: '2:30 PM',
        },
        {
          daysOfTheWeek: ['Monday', 'Friday'],
          start: '12:00 PM',
          end: '3:00 PM',
        },
      ],
      ['Fall', 'Spring'],
      [techElective]
    );

    const randomCourse2 = new Course(
      'DEF321',
      4,
      [
        {
          daysOfTheWeek: ['Monday', 'Wednesday', 'Friday'],
          start: '10:00 AM',
          end: '11:30 AM',
        },
      ],
      ['Spring'],
      [coreClass, probabilityReq]
    );

    const randomCourse3 = new Course(
      'PQR987',
      3,
      [
        {
          daysOfTheWeek: ['Monday', 'Tuesday', 'Wednesday'],
          start: '11:30 AM',
          end: '1:00 PM',
        },
        {
          daysOfTheWeek: ['Thursday', 'Friday'],
          start: '1:00 PM',
          end: '2:30 PM',
        },
      ],
      ['Fall'],
      [engrdReq, techElective]
    );

    // Enough time to walk to this class.
    const randomCourse4 = new Course(
      'LMN654',
      4,
      [
        {
          daysOfTheWeek: ['Monday', 'Wednesday', 'Friday'],
          start: '8:55 AM',
          end: '9:45 AM',
        },
        {
          daysOfTheWeek: ['Tuesday', 'Thursday'],
          start: '11:40 AM',
          end: '12:30 PM',
        },
      ],
      ['Spring'],
      [techElective]
    );

    // Enough time to walk to this class.
    const randomCourse5 = new Course(
      'RAC555',
      2,
      [
        {
          daysOfTheWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          start: '8:55 AM',
          end: '9:45 AM',
        },
        {
          daysOfTheWeek: ['Saturday'],
          start: '11:40 AM',
          end: '12:30 PM',
        },
      ],
      ['Fall'],
      [techElective, probabilityReq, engrdReq, coreClass]
    );

    const courses: Course[] = [
      cs1110,
      orie3300,
      info4430,
      engrd2700,
      additionalCourse1,
      additionalCourse2,
      randomCourse1,
      randomCourse2,
      randomCourse3,
      randomCourse4,
      randomCourse5,
    ];

    const requirements: Requirement[] = [
      techElective,
      coreClass,
      probabilityReq,
      engrdReq, // Assuming you also want to include this in the requirements as mentioned, though not explicitly added in the original Java code testing request.
    ];

    // Create request
    const interestingRequest = new GeneratorRequest(courses, requirements, 9, 'Fall');

    // Generate schedule with request
    const output = ScheduleGenerator.generateSchedule(interestingRequest);
    ScheduleGenerator.prettyPrintSchedule(output);
  }
}

// Direct call to main to simulate Java's public static void main(String[] args) execution.
// To run this, execute `ts-node src/schedule-generator/testing.ts` from the root of the project.
Testing.main();
