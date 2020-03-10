import decoratedReqsData from '@/requirements/decorated-requirements.json';
import { RequirementsJson } from './types';

// Cast the json to a stricter type of requirement with an enum `fulfilled` field for all requirements.
export default decoratedReqsData as unknown as RequirementsJson;
