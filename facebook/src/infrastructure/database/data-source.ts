import { DataSource } from "typeorm";
import { Breveria } from "../../interface-adapters/repositories/entity/Breveria";
import { Soneto } from "../../interface-adapters/repositories/entity/Soneto";

export async function createDataSource(database: string): Promise<DataSource> {
  const dataSource = new DataSource({
    type: "sqlite",
    database: database,
    entities: [Breveria, Soneto],
    synchronize: false,
  });
  await dataSource.initialize();
  return dataSource;
}
