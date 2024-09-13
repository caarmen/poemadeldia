import { FacebookError, IFacebookPageApi } from "./IFacebookPageApi";
import { IFacebookService } from "../../domain/interfaces/IFacebookService";
import { GenericError } from "../../domain/errors";

export class FacebookService implements IFacebookService {
  constructor(private pageApi: IFacebookPageApi) {}

  async postToPage(pageId: string, content: string): Promise<void> {
    try {
      await this.pageApi.postToPage(pageId, content);
    } catch (error: unknown) {
      if (error instanceof FacebookError) {
        throw new GenericError(error.message, error.response);
      }
      throw error;
    }
  }
}
