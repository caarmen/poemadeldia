import "reflect-metadata";
import { parseArgs } from "node:util";
import { bootstrapPostPoemUseCase } from "./bootstrap";
import { GenericError } from "./domain/errors";

async function main() {
  const commandLineArguments = getCommandLineArguments();
  const postPoemUseCase = await bootstrapPostPoemUseCase(commandLineArguments);
  try {
    await postPoemUseCase.execute();
  } catch (error: unknown) {
    if (error instanceof GenericError) {
      console.error("%o: %o", error.message, error.detail);
    } else {
      console.error("%o", error);
    }
    process.exit(1);
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
