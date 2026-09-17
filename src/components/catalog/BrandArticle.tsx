import type { BrandArticle as Article } from "@/lib/content/brand-article";

// Статья о марке из контент-пакета заказчика. По решению заказчика лежит на
// том же адресе, что и каталог марки, ниже сетки моделей: SEO-текст написан
// под коммерческую страницу («Часы Longines — купить…»), разделять их вредно.
//
// Слева — оглавление по разделам, липкое на десктопе: статья на 6000+ знаков,
// без навигации в ней тонешь.
export function BrandArticle({ article, brandName }: { article: Article; brandName: string }) {
  return (
    <div className="pad-x pad-y border-t border-line">
      <div className="grid gap-[40px] desktop:grid-cols-[220px_1fr] desktop:gap-[56px]">
        <nav aria-label={`Разделы статьи о ${brandName}`} className="desktop:sticky desktop:top-[96px] desktop:self-start">
          <div className="eyebrow mb-[14px] text-muted">О марке</div>
          <ul className="flex flex-col gap-[8px]">
            {article.toc.map((t) => (
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

        {/* Разметка собрана на сборке из наших же файлов в content/brands —
            стороннего ввода здесь нет. */}
        <article className="prose-brand" dangerouslySetInnerHTML={{ __html: article.html }} />
      </div>
    </div>
  );
}

export default BrandArticle;
