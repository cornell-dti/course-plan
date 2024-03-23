// represents a coloured bubble that shows the group a requirement falls in
export type BubbleData = {
  requirementGroup: string;
  color: string;
};

export type SemesterRows = {
  // the body of the semester table
  body: string[][];
  // the list of bubbles for each course in the semester
  bubbles: BubbleData[][];
};

export type ClassesSchedule = {
  Monday: {
    title: string;
    name: string;
    color: string;
    timeStart: string;
    timeEnd: string;
  }[];
  Tuesday: {
    title: string;
    name: string;
    color: string;
    timeStart: string;
    timeEnd: string;
  }[];
  Wednesday: {
    title: string;
    name: string;
    color: string;
    timeStart: string;
    timeEnd: string;
  }[];
  Thursday: {
    title: string;
    name: string;
    color: string;
    timeStart: string;
    timeEnd: string;
  }[];
  Friday: {
    title: string;
    name: string;
    color: string;
    timeStart: string;
    timeEnd: string;
  }[];
  Saturday: {
    title: string;
    name: string;
    color: string;
    timeStart: string;
    timeEnd: string;
  }[];
  Sunday: {
    title: string;
    name: string;
    color: string;
    timeStart: string;
    timeEnd: string;
  }[];
};

export type ReqInfo = {
  name: string;
  type: 'College' | 'Minor' | 'Major' | 'Grad' | 'Uni';
  typeValue: string; // e.g. CoE, Computer Science, etc.
};
