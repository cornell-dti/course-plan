import { reactive } from 'vue';

type RequirementChoiceEditorState = { course: FirestoreSemesterCourse | null };
const state = reactive<RequirementChoiceEditorState>({ course: null });
export const immutableRequirementChoiceEditorState: Readonly<RequirementChoiceEditorState> = state;

export const openRequirementChoiceEditor = (course: FirestoreSemesterCourse): void => {
  state.course = course;
};
export const closeRequirementChoiceEditor = (): void => {
  state.course = null;
};
