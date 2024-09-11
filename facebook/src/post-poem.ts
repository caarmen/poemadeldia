import "reflect-metadata";
import { selectRandomPoem } from "./select-poem";
import { renderBreveria, renderSoneto } from "./render-poem";
import { Breveria } from "./entity/Breveria";

async function main() {
  const randomPoem = await selectRandomPoem("../example/poems.db");
  console.log("selected poem %o", randomPoem);
  const renderedPoem =
    randomPoem instanceof Breveria
      ? await renderBreveria(randomPoem)
      : await renderSoneto(randomPoem);
  console.log("rendered poem %o", renderedPoem);
  // TODO:
  // - Read the db from the cli.
  // - Add a service to fb-service to post to a page.
  // - Call this service to post the poem to the page.
}

main();
