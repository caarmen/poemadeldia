import "dotenv/config";

const FB_API_VERSION = process.env.FB_API_VERSION;
export const FB_BASE_URL = `https://graph.facebook.com/${FB_API_VERSION}`;
