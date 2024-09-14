export class GenericError extends Error {
  detail?: object;

  constructor(message: string, detail?: object) {
    super(message);
    this.detail = detail;
  }
}
