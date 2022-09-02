import sourceRequirements from './data';
import { AdvisorPackage } from './tools-types';

export default function getAdvisor(
  acronym: string,
  type: AdvisorPackage['type'],
  userName: FirestoreUserName
): AdvisorPackage[] {
  const advisors = extractAdvisors(type, acronym);
  if (advisors) {
    return advisors.advisors
      .filter(a => {
        if (a.checker) return a.checker(userName);
        return true;
      })
      .map(a => ({
        name: a.name,
        email: a.email,
        source: advisors.source,
        acronym,
        type,
      }));
  }
  return [];
}

function extractAdvisors(type: AdvisorPackage['type'], acronym: string) {
  const { college, major, minor } = sourceRequirements;
  let whole;
  switch (type) {
    case 'major':
      whole = Object.entries(major).find(([n]) => n === acronym);
      break;
    case 'minor':
      whole = Object.entries(minor).find(([n]) => n === acronym);
      break;
    case 'college':
      whole = Object.entries(college).find(([n]) => n === acronym);
      break;
    default:
      whole = undefined;
      break;
  }

  if (whole) {
    const { advisors } = whole[1];
    return advisors;
  }
  return undefined;
}
