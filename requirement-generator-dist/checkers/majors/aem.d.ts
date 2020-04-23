import { Course } from '../../types';
declare const _default: {
    aemManagementRequirements: ((course: Course) => boolean)[];
    aemEconomicsRequirements: ((course: Course) => boolean)[];
    aemQuantitativeMethodsRequirements: ((course: Course) => boolean)[];
    aemQuantitativeMethodsElectivesRequirements: (course: Course) => boolean;
    aemGradChallengeRequirementPart1: (course: Course) => boolean;
    aemGradChallengeRequirementPart2: (course: Course) => boolean;
    aemGradChallengeRequirementPart3: (course: Course) => boolean;
};
export default _default;
