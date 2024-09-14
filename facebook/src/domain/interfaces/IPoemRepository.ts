import { Soneto } from "../entities/Soneto";
import { Breveria } from "../entities/Breveria";

export interface IPoemRepository {
  getSonetoCount(): Promise<number>;
  selectRandomSoneto(): Promise<Soneto>;
  getBreveriaCount(): Promise<number>;
  selectRandomBreveria(): Promise<Breveria>;
}
