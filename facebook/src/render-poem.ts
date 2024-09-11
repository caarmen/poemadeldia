import { renderFile } from "ejs";
import { Breveria } from "./entity/Breveria";
import path from "node:path";
import { Soneto } from "./entity/Soneto";

export async function renderBreveria(breveria: Breveria): Promise<string> {
  return renderPoem("breveria.ejs", {
    ...breveria,
    poem_date: getPoemDate(breveria.year, breveria.month),
  });
}

export async function renderSoneto(soneto: Soneto): Promise<string> {
  return renderPoem("soneto.ejs", {
    ...soneto,
    poem_date: getPoemDate(soneto.year, soneto.month, soneto.day),
  });
}

function getPoemDate(
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

async function renderPoem(templateName: string, data: object): Promise<string> {
  const templatePath = path.resolve(__dirname, `../templates/${templateName}`);
  return await renderFile(templatePath, data);
}
