import { DecoratedRequirementsJson } from './types';

export default async function getDecoratedRequirementsJson(
  major?: readonly string[],
  minor?: readonly string[],
  college?: string,
  grad?: string
): Promise<DecoratedRequirementsJson> {
  try {
    const route = `http://localhost:3000/requirements/?major=${(major ?? []).join(',')}&minor=${(
      minor ?? []
    ).join(',')}&college=${college}&grad=${grad}`;
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
