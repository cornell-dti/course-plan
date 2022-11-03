// represents a coloured bubble that shows the group a requirement falls in
export type bubbleData = {
  requirementGroup: string;
  color: string;
};

export type semesterRows = {
  // the body of the semester table
  body: string[][];
  // the list of bubbles for each course in the semester
  bubbles: bubbleData[][];
};
