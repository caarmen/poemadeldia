import { parseArgs } from "node:util";
import { FB_BASE_URL } from "./config";
import { FacebookAuthApi } from "./infrastructure/external-services/FacebookAuthApi";
import { FacebookError } from "./interface-adapters/services/IFacebookPageApi";

async function main() {
  const facebookAuthApi = new FacebookAuthApi({
    baseUrl: FB_BASE_URL,
  });
  try {
    // Step 1: get short lived user access token from cli.
    const shortLivedUserAccessToken = getShortLivedUserAccesstoken();

    // Step 2: exchange short lived user access token -> long lived user access token.
    const longLivedUserAccesstoken =
      await facebookAuthApi.getLongLivedUserAccessToken(
        process.env.FB_APP_ID!,
        process.env.FB_CLIENT_SECRET!,
        shortLivedUserAccessToken,
      );
    console.log("Long lived user access token: %o", longLivedUserAccesstoken);

    // Step 3: get the app-scoped user id.
    const appScopedUserId = await facebookAuthApi.getAppScopedUserId(
      shortLivedUserAccessToken,
    );
    console.log("App-scoped user id: %o", appScopedUserId);

    // Step 4: exchange the long lived user accss token -> long lived page access token.
    const longLivedPageAccessToken =
      await facebookAuthApi.getLongLivedPageAccessToken(
        appScopedUserId,
        longLivedUserAccesstoken,
      );
    console.log("Long lived page access token: %o", longLivedPageAccessToken);
  } catch (error) {
    if (error instanceof FacebookError) {
      console.error("%o: %o", error.message, error?.response);
    } else {
      console.error("%o", error);
    }
  }
}

function getShortLivedUserAccesstoken(): string {
  const { positionals } = parseArgs({ allowPositionals: true });

  if (positionals.length !== 1) {
    throw new Error(
      `Usage: ${process.argv[1]} <fb_short_lived_user_access_token>`,
    );
  }
  return positionals[0];
}

main();
