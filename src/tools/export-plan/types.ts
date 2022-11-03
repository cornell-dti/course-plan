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
