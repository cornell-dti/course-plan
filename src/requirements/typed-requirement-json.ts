import reqsData from '@/requirements/reqs.json';
import { StrictFulfilledByType, RequirementsJson } from './types';

// Cast the json to a stricter type of requirement with an enum `fulfilled` field for all requirements.
export default (reqsData as RequirementsJson<StrictFulfilledByType>);
