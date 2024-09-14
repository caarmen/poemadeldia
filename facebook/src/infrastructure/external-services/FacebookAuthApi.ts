import { createAxios } from "./axios-instance";
import { FbServiceConfig } from "./fb-config";

export class FacebookAuthApi {
  private axios;
  constructor(config: FbServiceConfig) {
    this.axios = createAxios({
      baseUrl: config.baseUrl,
    });
  }

  async getLongLivedUserAccessToken(
    fbAppId: string,
    fbClientSecret: string,
    shortLivedUserAccessToken: string,
  ): Promise<string> {
    const response = await this.axios.post("/oauth/access_token", {
      grant_type: "fb_exchange_token",
      client_id: fbAppId,
      client_secret: fbClientSecret,
      fb_exchange_token: shortLivedUserAccessToken,
    });
    return response.data.access_token;
  }

  async getAppScopedUserId(shortLivedUserAccessToken: string): Promise<string> {
    const response = await this.axios.get("/debug_token", {
      params: {
        input_token: shortLivedUserAccessToken,
        access_token: shortLivedUserAccessToken,
      },
    });
    return response.data.data.user_id;
  }

  async getLongLivedPageAccessToken(
    appScopedUserId: string,
    longLivedUserAccesstoken: string,
  ): Promise<string> {
    const response = await this.axios.get(`/${appScopedUserId}/accounts`, {
      params: {
        access_token: longLivedUserAccesstoken,
      },
    });
    return response.data.data[0].access_token;
  }
}
