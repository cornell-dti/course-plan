export default class Requirement {
  name: string; // effectively name

  for: 'College' | 'Major' | 'Minor' | 'Grad' | 'Uni';

  typeValue: string;

  constructor(
    name: string,
    forType: 'College' | 'Major' | 'Minor' | 'Grad' | 'Uni',
    typeValue: string
  ) {
    this.name = name;
    this.for = forType;
    this.typeValue = typeValue;
  }
}
