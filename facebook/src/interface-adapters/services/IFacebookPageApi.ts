export class FacebookError extends Error {
  response?: object;

  constructor(message: string, response?: object) {
    super(message);
    this.response = response;
  }
}
export interface IFacebookPageApi {
  postToPage(pageId: string, content: string): Promise<void>;
}
