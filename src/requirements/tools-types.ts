export type AdvisorPackage = {
  readonly name: string;
  readonly type: 'major' | 'minor' | 'college';
  readonly source: string;
  readonly acronym: string;
  readonly email: string;
};
