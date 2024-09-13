import { IFacebookService } from "../domain/interfaces/IFacebookService";

export class FacebookPostMessageToPageUseCase {
  constructor(private facebookService: IFacebookService) {}

  async execute(pageId: string, content: string): Promise<void> {
    await this.facebookService.postToPage(pageId, content);
  }
}
