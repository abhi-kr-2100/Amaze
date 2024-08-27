export class InvalidAgentOrTreasureCountError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidAgentOrTreasureCountError";
  }
}
