import { ArticleBody } from "@/components/ArticleBody";
import type { MarkdownPage } from "@/lib/content/markdown-page";

// Статья о марке из контент-пакета заказчика. По решению заказчика лежит на
// том же адресе, что и каталог марки, ниже сетки моделей: SEO-текст написан
// под коммерческую страницу («Часы Longines — купить…»), разделять их вредно.
export function BrandArticle({
  article,
  brandName,
}: {
  article: MarkdownPage;
  brandName: string;
}) {
  return (
    <div className="pad-x pad-y border-t border-line">
      <ArticleBody
        page={article}
        tocLabel="О марке"
        ariaLabel={`Разделы статьи о ${brandName}`}
      />
    </div>
  );
}

export default BrandArticle;
