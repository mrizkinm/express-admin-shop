export class ResponseError extends Error {
  constructor(public status: number, public message: any) {
      super(message);
  }
}