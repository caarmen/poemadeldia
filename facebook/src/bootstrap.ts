import "reflect-metadata";
import { FB_BASE_URL } from "./config";

import { createDataSource } from "./infrastructure/database/data-source";
import { FacebookPageApi } from "./infrastructure/external-services/FacebookPageApi";

import { Breveria } from "./interface-adapters/repositories/entity/Breveria";
import { Soneto } from "./interface-adapters/repositories/entity/Soneto";
import { TypeOrmRepository } from "./interface-adapters/repositories/TypeOrmPoemRepository";
import { FacebookService } from "./interface-adapters/services/FacebookService";

import { SelectRandomPoemUseCase } from "./use-cases/SelectRandomPoemUseCase";
import { RenderPoemUseCase } from "./use-cases/RenderPoemUseCase";
import { FacebookPostMessageToPageUseCase } from "./use-cases/FacebookPostMessageToPageUseCase";
import { PostPoemUseCase } from "./use-cases/PostPoemUseCase";

export async function bootstrapPostPoemUseCase(config: {
  databasePath: string;
  accessToken: string;
}): Promise<PostPoemUseCase> {
  // Create infrastructure:
  const dataSource = await createDataSource(config.databasePath);

  const facebookPageApi = new FacebookPageApi(
    {
      baseUrl: FB_BASE_URL,
    },
    config.accessToken,
  );

  // Create interface adapters:
  const poemRepository = new TypeOrmRepository(
    dataSource.getRepository(Soneto),
    dataSource.getRepository(Breveria),
  );

  const facebookService = new FacebookService(facebookPageApi);

  // Create use cases:
  const selectRandomPoemUseCase = new SelectRandomPoemUseCase(poemRepository);
  const renderPoemUseCase = new RenderPoemUseCase();
  const postToFacebookUseCase = new FacebookPostMessageToPageUseCase(
    facebookService,
  );

  return new PostPoemUseCase(
    selectRandomPoemUseCase,
    renderPoemUseCase,
    postToFacebookUseCase,
  );
}
