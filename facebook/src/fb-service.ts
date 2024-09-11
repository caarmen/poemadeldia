import axios from "axios";

interface FbServiceConfig {
  baseUrl: string;
}

function createFbService(config: FbServiceConfig) {
  return {
    async getLongLivedUserAccessToken(
      fbAppId: string,
      fbClientSecret: string,
      shortLivedUserAccessToken: string,
    ): Promise<string> {
      const response = await axios.post(
        `${config.baseUrl}/oauth/access_token`,
        {
          grant_type: "fb_exchange_token",
          client_id: fbAppId,
          client_secret: fbClientSecret,
          fb_exchange_token: shortLivedUserAccessToken,
        },
      );
      return response.data.access_token;
    },

    async getAppScopedUserId(
      shortLivedUserAccessToken: string,
    ): Promise<string> {
      const response = await axios.get(`${config.baseUrl}/debug_token`, {
        params: {
          input_token: shortLivedUserAccessToken,
          access_token: shortLivedUserAccessToken,
        },
      });
      return response.data.data.user_id;
    },

    async getLongLivedPageAccessToken(
      appScopedUserId: string,
      longLivedUserAccesstoken: string,
    ): Promise<string> {
      const response = await axios.get(
        `${config.baseUrl}/${appScopedUserId}/accounts`,
        {
          params: {
            access_token: longLivedUserAccesstoken,
          },
        },
      );
      return response.data.data[0].access_token;
    },

    async postToPage(
      fbPageId: string,
      longLivedPageAccessToken: string,
      message: string,
    ) {
      await axios.post(
        `${config.baseUrl}/${fbPageId}/feed`,
        {
          message: message,
          access_token: longLivedPageAccessToken,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );
    },
  };
}

export default createFbService;
