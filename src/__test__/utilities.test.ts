import { allocateSubjectColor } from '../utilities';

it('allocateSubjectColor first 6 colors have no duplicates.', () => {
  // Repeat 20 times to avoid getting lucky with randomization.
  for (let i = 0; i < 20; i += 1) {
    const subjectColor: Record<string, string> = {};
    allocateSubjectColor(subjectColor, 'CS');
    allocateSubjectColor(subjectColor, 'MATH');
    allocateSubjectColor(subjectColor, 'ECE');
    allocateSubjectColor(subjectColor, 'INFO');
    allocateSubjectColor(subjectColor, 'ISST');
    allocateSubjectColor(subjectColor, 'ORIE');
    expect(new Set(Object.values(subjectColor)).size).toBe(6);
  }
  // Cannot test other things since object key order is unreliable.
});
