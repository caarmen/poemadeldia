import "reflect-metadata";
import { selectRandomPoem } from "./select-poem";

async function main() {
  const randomPoem = await selectRandomPoem("../example/poems.db");
  console.log("selected poem %o", randomPoem);
  // TODO:
  // - Read the db from the cli.
  // - Pass the poem to the rendering engine (template based) to get a txt representation.
  // - Add a service to fb-service to post to a page.
  // - Call this service to post the poem to the page.
}

main();
