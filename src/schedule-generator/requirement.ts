export default class Requirement {
  private type: string;

  constructor(type?: string) {
    this.type = type || '';
  }

  getType(): string {
    return this.type;
  }

  setType(type: string): void {
    this.type = type;
  }
}
