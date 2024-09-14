import { AxiosError } from "axios";
import {
  FacebookError,
  IFacebookPageApi,
} from "../../interface-adapters/services/IFacebookPageApi";
import { createAxios } from "./axios-instance";
import { FbServiceConfig } from "./fb-config";

export class FacebookPageApi implements IFacebookPageApi {
  private axios;
  constructor(
    config: FbServiceConfig,
    private longLivedPageAccessToken: string,
  ) {
    this.axios = createAxios({
      baseUrl: config.baseUrl,
    });
  }

  async postToPage(pageId: string, content: string) {
    try {
      await this.axios.post(
        `/${pageId}/feed`,
        {
          message: content,
          access_token: this.longLivedPageAccessToken,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new FacebookError(error.message, error?.response?.data);
      }
      throw error;
    }
  }
}
