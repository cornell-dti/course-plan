export type AdvisorGroup = {
  readonly advisors: Advisor[];
  readonly source: string;
};

export type AdvisorChecker = (user: FirestoreUserName) => boolean;

export type Advisor = {
  readonly name: string;
  readonly email: string;
  readonly checker?: AdvisorChecker;
};

export type AdvisorPackage = {
  readonly name: string;
  readonly type: 'major' | 'minor' | 'college';
  readonly source: string;
  readonly acronym: string;
  readonly email: string;
};
