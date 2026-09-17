import fs from "node:fs";
import path from "node:path";

// Фотографии товаров. Съёмки ещё нет (§12 п.5 хендоффа), поэтому основной
// путь — плейсхолдеры с описанием нужного кадра.
//
// Файл `content/photos.local.json` — необязательный и лежит в .gitignore:
// в него кладут снимки для примерки вёрстки, не пуская их в репозиторий и на
// живой сайт. Нет файла — ничего не меняется, страницы собираются как прежде.
//
// Когда придут боевые фотографии, они лягут в `content/photos.json` рядом и
// будут читаться так же — эту функцию менять не придётся.
const LOCAL = path.join(process.cwd(), "content", "photos.local.json");
const REAL = path.join(process.cwd(), "content", "photos.json");

function read(file: string): Record<string, string[]> {
  if (!fs.existsSync(file)) return {};
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, string[]>;
  } catch {
    return {};
  }
}

export function photosFor(id: string): string[] {
  const map = { ...read(REAL), ...read(LOCAL) };
  const list = map[id];
  return Array.isArray(list) ? list : [];
}

/** Первый кадр — для карточки в сетке каталога. */
export function coverFor(id: string): string | undefined {
  return photosFor(id)[0];
}
