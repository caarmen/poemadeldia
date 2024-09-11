import "reflect-metadata";
import { parseArgs } from "node:util";
import { selectRandomPoem } from "./select-poem";
import { renderBreveria, renderSoneto } from "./render-poem";
import { Breveria } from "./entity/Breveria";

async function main() {
  const randomPoem = await selectRandomPoem(getDatabasePath());
  console.log("selected poem %o", randomPoem);
  const renderedPoem =
    randomPoem instanceof Breveria
      ? await renderBreveria(randomPoem)
      : await renderSoneto(randomPoem);
  console.log("rendered poem %o", renderedPoem);
  // TODO:
  // - Add a service to fb-service to post to a page.
  // - Call this service to post the poem to the page.
}

function getDatabasePath(): string {
  const { positionals } = parseArgs({ allowPositionals: true });

  if (positionals.length !== 1) {
    throw new Error(`Usage: ${process.argv[1]} </path/to/database>`);
  }
  return positionals[0];
}

main();
