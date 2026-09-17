import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

// Статьи о марках из контент-пакета заказчика (InBox/doc_txt.zip).
// Читаются на сборке: сайт статический, в рантайме файловой системы нет.

// Статьи разложены по разделам: часы и украшения адресуются разными
// маршрутами, а слаги у них могут совпасть.
export type Section = "watches" | "jewelry";

const dirFor = (section: Section) =>
  path.join(process.cwd(), "content", "brands", section);

export type BrandArticle = {
  /** Заголовки второго уровня — оглавление статьи. */
  toc: { id: string; title: string }[];
  html: string;
  seoTitle: string;
  seoDescription: string;
};

// Транслитерация для якорей: «История марки» → «istoriya-marki». Адрес
// раздела должно быть можно переслать, поэтому не «#s2», а читаемый якорь.
const MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh",
  щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

export function slugifyHeading(text: string): string {
  return (
    text
      .toLowerCase()
      .split("")
      .map((c) => MAP[c] ?? c)
      .join("")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "razdel"
  );
}

function stripEditorNotes(md: string): string {
  // <!-- ДЛЯ РЕДАКТОРА … --> — служебные заметки автора текстов. На сайт они
  // не выводятся, но в файлах остаются: там перечислены ошибки текущего сайта
  // и непроверенные данные, это рабочий материал.
  return md.replace(/<!--[\s\S]*?-->/g, "");
}

function stripLeadingH1(md: string): string {
  // У страницы марки уже есть <h1> с названием — по макету. Второй H1 из
  // статьи («Часы Longines») сделал бы на странице два первых заголовка.
  return md.replace(/^\s*#\s+.*\r?\n/, "");
}

export function getBrandArticle(section: Section, slug: string): BrandArticle | null {
  const file = path.join(dirFor(section), `${slug}.md`);
  if (!fs.existsSync(file)) return null;

  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const md = stripLeadingH1(stripEditorNotes(content)).trim();

  let html = marked.parse(md, { gfm: true, async: false }) as string;

  // Якоря и оглавление. Проще дописать id в готовый HTML, чем переопределять
  // рендерер marked: разметка наша собственная, из файлов в репозитории.
  const toc: { id: string; title: string }[] = [];
  const used = new Set<string>();

  html = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_m, inner: string) => {
    const title = inner.replace(/<[^>]+>/g, "").trim();
    let id = slugifyHeading(title);
    let n = 2;
    while (used.has(id)) id = `${slugifyHeading(title)}-${n++}`;
    used.add(id);
    toc.push({ id, title });
    return `<h2 id="${id}">${inner}</h2>`;
  });

  return {
    toc,
    html,
    seoTitle: String(data.seo_title ?? ""),
    seoDescription: String(data.seo_description ?? ""),
  };
}

export function brandArticleSlugs(section: Section): string[] {
  const dir = dirFor(section);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
