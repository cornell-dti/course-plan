import examData from '../../data/exams/ExamCredit';
import featureFlagCheckers from '../../feature-flags';
import type { TranscriptTestCredit } from './transcript-parser';

const words = (name: string): string[] =>
  name
    .toLowerCase()
    .replace(/&/g, ' and ')
    .match(/[a-z0-9]+/g) ?? [];

const isAbbreviationOf = (short: string, full: string): boolean => {
  let i = 0;
  for (let j = 0; j < full.length && i < short.length; j += 1) {
    if (short[i] === full[j]) i += 1;
  }
  return short[0] === full[0] && i === short.length;
};

const matchSubject = (subject: string, subjects: readonly string[], college?: string) => {
  const target = words(subject);
  const key = target.join(' ');
  if (key.endsWith('calculus ab')) return 'Mathematics AB';
  if (key.endsWith('calculus bc')) {
    return `Mathematics BC (${college === 'EN' ? 'Engineering' : 'Non-Engineering'})`;
  }
  const exact = subjects.find(name => words(name).join(' ') === key);
  if (exact) return exact;
  const candidates = subjects.filter(name => {
    const full = words(name);
    return full.length === target.length && target.every((w, i) => isAbbreviationOf(w, full[i]));
  });
  return candidates.length === 1 ? candidates[0] : null;
};

const toExam = (credit: TranscriptTestCredit, college?: string): FirestoreTransferExam | null => {
  if (credit.examType === 'CASE') {
    if (!featureFlagCheckers.isCaseEnabled()) return null;
    const fulfillments = credit.code ? examData.CASE[credit.code] : undefined;
    if (credit.code == null || !fulfillments?.some(f => f.score === 'Pass')) return null;
    return { examType: 'CASE', subject: credit.code, score: 'Pass' };
  }
  const subject = matchSubject(credit.subject, Object.keys(examData[credit.examType]), college);
  if (subject == null) return null;
  return { examType: credit.examType, subject, score: Math.round(credit.score) };
};

const transcriptTestCreditsToExams = (
  credits: readonly TranscriptTestCredit[],
  college?: string
): { exams: FirestoreTransferExam[]; skipped: number } => {
  const exams = new Map<string, FirestoreTransferExam>();
  const skipped = new Set<string>();
  credits.forEach(credit => {
    const exam = toExam(credit, college);
    if (exam == null) {
      skipped.add(`${credit.examType} ${credit.subject}`);
      return;
    }
    const key = `${exam.examType} ${exam.subject}`;
    const previous = exams.get(key);
    if (previous == null || Number(previous.score) < Number(exam.score)) exams.set(key, exam);
  });
  return { exams: Array.from(exams.values()), skipped: skipped.size };
};

export default transcriptTestCreditsToExams;
