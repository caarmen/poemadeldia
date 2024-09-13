export interface IFacebookService {
  postToPage(pageId: string, content: string): Promise<void>;
}
