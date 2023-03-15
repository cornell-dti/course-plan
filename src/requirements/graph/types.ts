export interface CourseWithUniqueId {
  readonly uniqueId: string | number;
}

export interface CourseForRequirementGraph extends CourseWithUniqueId {
  readonly courseId: number;
}
