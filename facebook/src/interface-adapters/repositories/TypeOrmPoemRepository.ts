import { Repository } from "typeorm";

import { Breveria } from "../../domain/entities/Breveria";
import { Soneto } from "../../domain/entities/Soneto";
import { Breveria as BreveriaDto } from "./entity/Breveria";
import { Soneto as SonetoDto } from "./entity/Soneto";
import { IPoemRepository } from "../../domain/interfaces/IPoemRepository";

export class TypeOrmRepository implements IPoemRepository {
  constructor(
    private repositorySoneto: Repository<SonetoDto>,
    private repositoryBreveria: Repository<BreveriaDto>,
  ) {}

  async getSonetoCount(): Promise<number> {
    return this.repositorySoneto.count();
  }

  async selectRandomSoneto(): Promise<Soneto> {
    const sonetoDto = await this.repositorySoneto
      .createQueryBuilder()
      .orderBy("RANDOM()")
      .limit(1)
      .getOneOrFail();
    const soneto = new Soneto();
    Object.assign(soneto, sonetoDto);
    return soneto;
  }

  async getBreveriaCount(): Promise<number> {
    return this.repositoryBreveria.count();
  }

  async selectRandomBreveria(): Promise<Breveria> {
    const breveriaDto = await this.repositoryBreveria
      .createQueryBuilder()
      .orderBy("RANDOM()")
      .limit(1)
      .getOneOrFail();

    const breveria = new Breveria();
    Object.assign(breveria, breveriaDto);
    return breveria;
  }
}
