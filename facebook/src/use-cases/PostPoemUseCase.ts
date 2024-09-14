import { GenericError } from "../domain/errors";
import { FacebookPostMessageToPageUseCase } from "./FacebookPostMessageToPageUseCase";
import { RenderPoemUseCase } from "./RenderPoemUseCase";
import { SelectRandomPoemUseCase } from "./SelectRandomPoemUseCase";

export class PostPoemUseCase {
  constructor(
    private selectRandomPoemUseCase: SelectRandomPoemUseCase,
    private renderPoemUseCase: RenderPoemUseCase,
    private facebookPostMessageToPageUseCase: FacebookPostMessageToPageUseCase,
  ) {}

  async execute(): Promise<void> {
    const randomPoem = await this.selectRandomPoemUseCase.execute();
    console.log("selected %o", randomPoem);

    const renderedPoem = await this.renderPoemUseCase.execute(randomPoem);
    console.log("rendered poem %o", renderedPoem);

    await this.facebookPostMessageToPageUseCase.execute(
      process.env.FB_PAGE_ID!,
      renderedPoem,
    );
  }
}
