import { Course } from '../../types';
import { courseMatchesCodeOptions } from '../checkers-common';

const calsCredits = (course: Course): boolean => ['AG', 'BU'].includes(course.acadGroup);

const calsIntroductoryLifeSciencesOrBiology = (course: Course): boolean => courseMatchesCodeOptions(
  course,
  [
    'ANSC 1100',
    'BIOAP 1100',
    'BIOEE 1560',
    'BIOEE 1610',
    'BIOEE 1610',
    'BIOEE 1610',
    'BIOEE 1610',
    'BIOEE 1780',
    'BIOEE 1780',
    'BIOEE 1780',
    'BIOEE 2070',
    'BIOEE 2526',
    'BIOG 1106',
    'BIOG 1140',
    'BIOG 1140',
    'BIOG 1191',
    'BIOG 1440',
    'BIOG 1440',
    'BIOG 1440',
    'BIOG 1445',
    'BIOG 1445',
    'BIOG 1500',
    'BIOG 1500',
    'BIOG 1500',
    'BIOMG 1150',
    'BIOMG 1290',
    'BIOMG 1350',
    'BIOMG 1350',
    'BIOMG 1350',
    'BIOMI 1100',
    'BIOMI 1120',
    'BIOPL 1120',
    'BIOPL 1130',
    'BIOPL 2400',
    'BIOPL 2410',
    'BIOPL 2490',
    'BIOSM 1500',
    'BIOSM 1551',
    'BIOSM 1610',
    'BIOSM 1650',
    'BIOSM 1780',
    'CSS 1120',
    'EAS 1560',
    'ENTOM 2011',
    'ENTOM 2020',
    'ENTOM 2030',
    'FDSC 2204',
    'HORT 1115',
    'HORT 2204',
    'PLBIO 2100',
    'PLBIO 2400',
    'PLBIO 2410',
    'PLBIO 2450',
    'PLBIO 2470',
    'PLBIO 2490',
    'PLBRG 2010',
    'PLHRT 1115',
    'PLHRT 2204',
    'PLPA 2013',
    'PLPA 2015',
    'PLPA 2900',
    'PLPPM 2013',
    'PLPPM 2015',
    'PLPPM 2900',
    'PLSCI 1150',
    'PLSCI 1300',
    'PLSCI 1420',
    'PLSCI 4190',
    'PLSCS 1120',
    'STS 2871',
    'VIEN 2204'
  ]
);

const calsChemistryOrPhysics = (course: Course): boolean => ['CHEM', 'CHEME', 'PHYS'].includes(course.subject);

const calsQuantitativeLiteracy = (course: Course): boolean => ['MATH', 'STSCI'].includes(course.subject);

const calsSocialSciencesAndHumanities = (course: Course): boolean => [
  '(CA-',
  '(D-',
  '(FL-',
  '(HA-',
  '(KCM-',
  '(LA-',
  '(SBA-'
  // REQ_TODO: has uniqueIncludes
  // REQ_TODO: the original reqs.json is probably wrong!
  // @ts-ignore
].some(code => course.code && course.code.includes(code));

const calsHumanDiversity = (course: Course): boolean => course.catalogDistr?.includes('(D-') ?? false;

const calsWrittenAndOralExpression = (course: Course): boolean => [
  'written expression',
  'oral expression',
  'First-Year Writing Seminar'
].some(keyword => course.catalogSatisfiesReq?.includes(keyword) ?? false);

const calsWrittenExpression = (course: Course): boolean => [
  'written expression',
  'First-Year Writing Seminar'
].some(keyword => course.catalogSatisfiesReq?.includes(keyword) ?? false);

export default {
  calsCredits,
  calsIntroductoryLifeSciencesOrBiology,
  calsChemistryOrPhysics,
  calsQuantitativeLiteracy,
  calsSocialSciencesAndHumanities,
  calsHumanDiversity,
  calsWrittenAndOralExpression,
  calsWrittenExpression
};
