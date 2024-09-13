import path from "node:path";
import { renderFile } from "ejs";

import { Breveria } from "../domain/entities/Breveria";
import { Soneto } from "../domain/entities/Soneto";

export class RenderPoemUseCase {
  async execute(poem: Breveria | Soneto): Promise<string> {
    if (poem instanceof Breveria) {
      return this.renderBreveria(poem);
    }
    return this.renderSoneto(poem);
  }

  private getPoemDate(
    year: string,
    month: string,
    day: string | null = null,
  ): string {
    const date = new Date(
      Number(year),
      Number(month) - 1,
      day === null ? 1 : Number(day),
    );
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      year: "numeric",
      day: "numeric",
    };

    if (day === null) {
      delete options.day;
    }
    return date.toLocaleString("es-ES", options);
  }

  private async renderBreveria(breveria: Breveria): Promise<string> {
    return this.renderPoem("breveria.ejs", {
      ...breveria,
      poem_date: this.getPoemDate(breveria.year, breveria.month),
    });
  }

  private async renderSoneto(soneto: Soneto): Promise<string> {
    return this.renderPoem("soneto.ejs", {
      ...soneto,
      poem_date: this.getPoemDate(soneto.year, soneto.month, soneto.day),
    });
  }

  private async renderPoem(
    templateName: string,
    data: object,
  ): Promise<string> {
    const templatePath = path.resolve(
      __dirname,
      `../../templates/${templateName}`,
    );
    return await renderFile(templatePath, data);
  }
}
