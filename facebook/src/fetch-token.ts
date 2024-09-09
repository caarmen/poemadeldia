import { parseArgs } from "node:util";
import createFbService from "./fb-service";
import { FB_BASE_URL } from "./config";

async function main() {
  const fbService = createFbService({ baseUrl: FB_BASE_URL });
  try {
    const shortLivedUserAccessToken = getShortLivedUserAccesstoken();
    const longLivedUserAccesstoken =
      await fbService.getLongLivedUserAccessToken(
        process.env.FB_APP_ID!,
        process.env.FB_CLIENT_SECRET!,
        shortLivedUserAccessToken,
      );
    console.log("Long lived user access token: %o", longLivedUserAccesstoken);
    const appScopedUserId = await fbService.getAppScopedUserId(
      shortLivedUserAccessToken,
    );
    console.log("App-scoped user id: %o", appScopedUserId);

    const longLivedPageAccessToken =
      await fbService.getLongLivedPageAccessToken(
        appScopedUserId,
        longLivedUserAccesstoken,
      );
    console.log("Long lived page access token: %o", longLivedPageAccessToken);
  } catch (error) {
    console.error("%o: %o", error.message, error?.response?.data);
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
