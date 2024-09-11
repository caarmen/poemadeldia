import "reflect-metadata";
import { parseArgs } from "node:util";
import { selectRandomPoem } from "./select-poem";
import { renderBreveria, renderSoneto } from "./render-poem";
import { Breveria } from "./entity/Breveria";
import createFbService from "./fb-service";
import { FB_BASE_URL } from "./config";

async function main() {
  const commandLineArguments = getCommandLineArguments();
  const randomPoem = await selectRandomPoem(commandLineArguments.databasePath);
  console.log("selected poem %o", randomPoem);
  const renderedPoem =
    randomPoem instanceof Breveria
      ? await renderBreveria(randomPoem)
      : await renderSoneto(randomPoem);
  console.log("rendered poem %o", renderedPoem);
  const fbService = createFbService({ baseUrl: FB_BASE_URL });
  try {
    await fbService.postToPage(
      process.env.FB_PAGE_ID!,
      commandLineArguments.accessToken,
      renderedPoem,
    );
  } catch (error) {
    console.error("%o: %o", error.message, error?.response?.data);
  }
}

function getCommandLineArguments(): {
  databasePath: string;
  accessToken: string;
} {
  const { positionals } = parseArgs({ allowPositionals: true });

  if (positionals.length !== 2) {
    throw new Error(
      `Usage: ${process.argv[1]} </path/to/database> <access_token>`,
    );
  }
  return {
    databasePath: positionals[0],
    accessToken: positionals[1],
  };
}

main();
