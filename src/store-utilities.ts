import store from '@/store';

export function getCollegeFullName(acronym: string | undefined): string {
  // return Arts and Sciences for AS, AS1, or AS2
  if (acronym && acronym.startsWith('AS')) {
    return 'Arts and Sciences';
  }
  if (!store.state.storedRequirementsJSON.college) {
    return '';
  }
  const college = acronym ? store.state.storedRequirementsJSON.college[acronym] : null;

  // Return empty string if college is not in requirementJSON
  return college ? college.name : '';
}

export function getMajorFullName(acronym: string): string {
  // Return empty string if major is not in requirementJSON
  if (!store.state.storedRequirementsJSON.major) {
    return '';
  }
  const major = store.state.storedRequirementsJSON.major[acronym];
  return major ? major.name : '';
}

export function getMinorFullName(acronym: string): string {
  // Return empty string if minor is not in requirementJSON
  if (!store.state.storedRequirementsJSON.minor) {
    return '';
  }
  const minor = store.state.storedRequirementsJSON.minor[acronym];
  return minor ? minor.name : '';
}

export function getGradFullName(acronym: string | undefined): string {
  // Return empty string if grad is not in requirementJSON
  if (!store.state.storedRequirementsJSON.grad) {
    return '';
  }
  const grad = acronym ? store.state.storedRequirementsJSON.grad[acronym] : null;
  return grad ? grad.name : '';
}
