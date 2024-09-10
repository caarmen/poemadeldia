import { DataSource } from "typeorm";
import { Breveria } from "./entity/Breveria";
import { Soneto } from "./entity/Soneto";

export function createDataSource(database: string): DataSource {
  return new DataSource({
    type: "sqlite",
    database: database,
    entities: [Breveria, Soneto],
    synchronize: false,
  });
}
