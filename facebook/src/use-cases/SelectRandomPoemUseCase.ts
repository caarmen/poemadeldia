import { Breveria } from "../domain/entities/Breveria";
import { Soneto } from "../domain/entities/Soneto";
import { IPoemRepository } from "../domain/interfaces/IPoemRepository";

export class SelectRandomPoemUseCase {
  constructor(private poemRepository: IPoemRepository) {}
  async execute(): Promise<Breveria | Soneto> {
    const breveriaCount = await this.poemRepository.getBreveriaCount();
    const sonetoCount = await this.poemRepository.getSonetoCount();
    const totalPoemCount = breveriaCount + sonetoCount;
    const randomPoemIndex = Math.random() * totalPoemCount;

    return randomPoemIndex < breveriaCount
      ? this.poemRepository.selectRandomBreveria()
      : this.poemRepository.selectRandomSoneto();
  }
}
