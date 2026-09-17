import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { asset } from "@/lib/asset";

// Разбор страниц из Markdown: статьи о марках и справочные страницы
// (`content/brands/**`, `content/info/**`). Всё считается на этапе сборки —
// сайт статический, в рантайме файловой системы нет.

export type MarkdownPage = {
  /** Заголовки второго уровня — оглавление страницы. */
  toc: { id: string; title: string }[];
  html: string;
  /** h1 из frontmatter: заголовок страницы. */
  h1: string;
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

// Упоминания справочных страниц в текстах — обычный текст в ёлочках, ссылок
// автор не ставил: он писал под другой сайт и не знал наших адресов. Здесь
// они становятся ссылками, сам текст при этом не меняется.
//
// «Сервис», «Оплата и доставка», «Возврат товара» и «Сравнить товары» в
// списке отсутствуют намеренно: таких страниц у нас пока нет, и ссылка вела
// бы в 404.
const REFS: { label: string; href: string }[] = [
  { label: "Гарантия", href: "/info/garantia/" },
  { label: "Характеристики часов", href: "/info/harakteristiki/" },
];

function linkifyRefs(html: string, selfHref?: string): string {
  let out = html;
  for (const ref of REFS) {
    if (ref.href === selfHref) continue; // страница не ссылается сама на себя
    // basePath в разметку из Markdown Next не подставляет — только asset().
    const href = asset(ref.href);
    out = out.replace(
      new RegExp(`«${ref.label}»`, "g"),
      `«<a href="${href}">${ref.label}</a>»`,
    );
  }
  return out;
}

// [ПРОВЕРИТЬ …] — вопросы автора текста к салону, оставленные прямо в тексте.
// Подсвечиваем, чтобы на показе было видно: это не готовая формулировка.
// Когда вопросы закроются, скобки уйдут из md, и подсветка пропадёт сама.
function markTodos(html: string): string {
  return html.replace(
    /\[ПРОВЕРИТЬ[^\]]*\]/g,
    (m) => `<mark class="todo">${m}</mark>`,
  );
}

function stripEditorNotes(md: string): string {
  // <!-- ДЛЯ РЕДАКТОРА … --> — служебные заметки автора текстов: ошибки
  // текущего сайта, непроверенные данные, замечания к фильтрам. В репозитории
  // они нужны, на сайте им не место.
  return md.replace(/<!--[\s\S]*?-->/g, "");
}

function stripLeadingH1(md: string): string {
  // Заголовок страницы рисует сама страница (по макету — своей типографикой),
  // поэтому H1 из тела убираем: иначе на странице два первых заголовка.
  return md.replace(/^\s*#\s+.*\r?\n/, "");
}

function readPage(file: string, selfHref?: string): MarkdownPage | null {
  if (!fs.existsSync(file)) return null;

  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const md = stripLeadingH1(stripEditorNotes(content)).trim();

  let html = marked.parse(md, { gfm: true, async: false }) as string;
  html = markTodos(linkifyRefs(html, selfHref));

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
    h1: String(data.h1 ?? ""),
    seoTitle: String(data.seo_title ?? ""),
    seoDescription: String(data.seo_description ?? ""),
  };
}

// ─── Статьи о марках ─────────────────────────────────────────────────────

export type Section = "watches" | "jewelry";

export type BrandArticle = MarkdownPage;

export function getBrandArticle(section: Section, slug: string): BrandArticle | null {
  return readPage(path.join(process.cwd(), "content", "brands", section, `${slug}.md`));
}

export function brandArticleSlugs(section: Section): string[] {
  const dir = path.join(process.cwd(), "content", "brands", section);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

// ─── Справочные страницы /info ───────────────────────────────────────────

export function getInfoPage(slug: string): MarkdownPage | null {
  return readPage(
    path.join(process.cwd(), "content", "info", `${slug}.md`),
    `/info/${slug}/`,
  );
}

export function infoSlugs(): string[] {
  const dir = path.join(process.cwd(), "content", "info");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}
