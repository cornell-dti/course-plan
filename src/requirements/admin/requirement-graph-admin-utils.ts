import { createAppOnboardingData } from '../../user-data-converter';
import { checkNotNull } from '../../utilities';
import {
  semestersCollection,
  toggleableRequirementChoicesCollection,
  selectableRequirementChoicesCollection,
  onboardingDataCollection,
} from '../../firebase-admin-config';
import { getCourseCodesArray } from '../requirement-frontend-computation';
import buildRequirementFulfillmentGraphFromUserData from '../requirement-graph-builder-from-user-data';
import RequirementFulfillmentGraph from '../requirement-graph';

interface UserRequirementDataOnAdmin {
  readonly courses: readonly CourseTaken[];
  readonly onboardingData: AppOnboardingData;
  readonly toggleableRequirementChoices: Readonly<Record<string, string>>;
  readonly selectableRequirementChoices: Readonly<Record<string, string>>;
  readonly userRequirements: readonly RequirementWithIDSourceType[];
  readonly requirementFulfillmentGraph: RequirementFulfillmentGraph<string, CourseTaken>;
}

export default async function getUserRequirementDataOnAdmin(
  userEmail: string
): Promise<UserRequirementDataOnAdmin> {
  const [
    semesters,
    toggleableRequirementChoices,
    selectableRequirementChoices,
    onboardingData,
  ] = await Promise.all([
    semestersCollection
      .doc(userEmail)
      .get()
      .then(it => checkNotNull(it.data()).semesters),
    toggleableRequirementChoicesCollection
      .doc(userEmail)
      .get()
      .then(it => it.data() || {}),
    selectableRequirementChoicesCollection
      .doc(userEmail)
      .get()
      .then(it => it.data() || {}),
    onboardingDataCollection
      .doc(userEmail)
      .get()
      .then(it => createAppOnboardingData(checkNotNull(it.data()))),
  ]);

  const courses = getCourseCodesArray(semesters, onboardingData);
  const {
    userRequirements,
    requirementFulfillmentGraph,
  } = buildRequirementFulfillmentGraphFromUserData(
    courses,
    onboardingData,
    toggleableRequirementChoices,
    selectableRequirementChoices,
    {}
  );

  return {
    courses,
    onboardingData,
    toggleableRequirementChoices,
    selectableRequirementChoices,
    userRequirements,
    requirementFulfillmentGraph,
  };
}
