import { DecoratedRequirementsJson } from './types';

// TODO: update to real firebase function URL
const BASE_URL = 'http://127.0.0.1:5001/advanced-todos-73680/us-central1/api/requirements';

export default async function getDecoratedRequirementsJson(
  major?: readonly string[],
  minor?: readonly string[],
  college?: string,
  grad?: string
): Promise<DecoratedRequirementsJson> {
  try {
    let formattedMajors = (major ?? []).join(',');
    if (formattedMajors.length === 0) {
      formattedMajors = 'skip-this';
    }

    let formattedMinors = (minor ?? []).join(',');
    if (formattedMinors.length === 0) {
      formattedMinors = 'skip-this';
    }

    let formattedGrad = grad;
    if (!grad) {
      formattedGrad = 'skip-this';
    }

    const route = `${BASE_URL}?major=${formattedMajors}&minor=${formattedMinors}&college=${college}&grad=${formattedGrad}`;
    const response = await fetch(route);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as DecoratedRequirementsJson;
    return data;
  } catch (e) {
    // FIXME: the alternative is to return a default json, but that
    // defeats the whole purpose. Maybe throw an error here?
    return {} as DecoratedRequirementsJson;
  }
}
