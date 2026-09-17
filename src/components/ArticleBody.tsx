import type { MarkdownPage } from "@/lib/content/markdown-page";

// Текст из Markdown с оглавлением слева. Общий для статей о марках и
// справочных страниц /info: страницы длинные (6000+ знаков), без навигации
// по разделам в них тонешь.
//
// Оглавление липкое на десктопе; на мобильном просто стоит перед текстом.
export function ArticleBody({
  page,
  tocLabel,
  ariaLabel,
}: {
  page: MarkdownPage;
  tocLabel: string;
  ariaLabel: string;
}) {
  return (
    <div className="grid gap-[40px] desktop:grid-cols-[220px_1fr] desktop:gap-[56px]">
      <nav aria-label={ariaLabel} className="desktop:sticky desktop:top-[96px] desktop:self-start">
        <div className="eyebrow mb-[14px] text-muted">{tocLabel}</div>
        <ul className="flex flex-col gap-[8px]">
          {page.toc.map((t) => (
            <li key={t.id}>
              <a
                href={`#${t.id}`}
                className="text-[13px] leading-[1.4] text-muted transition-colors hover:text-ink"
              >
                {t.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Разметка собрана на сборке из наших же файлов в content/ — стороннего
          ввода здесь нет. */}
      <article className="prose-doc" dangerouslySetInnerHTML={{ __html: page.html }} />
    </div>
  );
}

export default ArticleBody;
