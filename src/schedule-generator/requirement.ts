export default class Requirement {
  type: string;

  constructor(type?: string) {
    this.type = type || '';
  }
}
