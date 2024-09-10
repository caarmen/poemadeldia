import "reflect-metadata";
import { Breveria } from "./entity/Breveria";
import { Soneto } from "./entity/Soneto";
import { Repository } from "typeorm";
import { createDataSource } from "./data-source";

export async function selectRandomPoem(
  database: string,
): Promise<Breveria | Soneto> {
  const dataSource = createDataSource(database);
  await dataSource.initialize();
  const breveriaRepository = dataSource.getRepository(Breveria);
  const sonetoRepository = dataSource.getRepository(Soneto);

  const poemRepository = await selectRandomPoemRepository(
    breveriaRepository,
    sonetoRepository,
  );
  return selectRandomPoemFromRepository(poemRepository);
}

async function selectRandomPoemFromRepository(
  repository: Repository<Breveria | Soneto>,
): Promise<Breveria | Soneto> {
  const poem = await repository
    .createQueryBuilder()
    .orderBy("RANDOM()")
    .limit(1)
    .getOne();
  if (!poem) {
    throw new Error("Didn't find any poem in the database");
  }
  return poem;
}

async function selectRandomPoemRepository(
  breveriaRepository: Repository<Breveria>,
  sonetoRepository: Repository<Soneto>,
): Promise<Repository<Breveria> | Repository<Soneto>> {
  const breveriaCount = await breveriaRepository.count();
  const sonetoCount = await sonetoRepository.count();
  const totalPoemCount = breveriaCount + sonetoCount;

  const randomPoemIndex = Math.random() * totalPoemCount;

  return randomPoemIndex < breveriaCount
    ? breveriaRepository
    : sonetoRepository;
}
