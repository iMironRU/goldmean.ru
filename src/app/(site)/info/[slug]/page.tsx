import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/ArticleBody";
import { getInfoPage, infoSlugs } from "@/lib/content/markdown-page";

// Справочные страницы из контент-пакета: гарантия и характеристики часов.
//
// В §4 хендоффа таких маршрутов нет — они пришли вместе с текстами марок, и
// на них ссылаются сами эти тексты (одна «Гарантия» упомянута 15 раз). Адреса
// взяты из пакета (`/info/garantia/`, `/info/harakteristiki/`): по ним же
// живут страницы текущего сайта, значит потом не понадобится редирект.
//
// Новый файл в content/info/ — новая страница, ничего дописывать не нужно.
type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return infoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getInfoPage(slug);
  if (!page) return {};
  return {
    // seo_title уже содержит «| Золотая середина» — absolute, иначе шаблон
    // корневого layout добавит название второй раз.
    title: page.seoTitle ? { absolute: page.seoTitle } : page.h1,
    description: page.seoDescription,
  };
}

export default async function InfoPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = getInfoPage(slug);
  if (!page) notFound();

  return (
    <>
      {/* Справочная страница — это чтение, а не витрина: колонка «оглавление
          плюс текст» шириной 956 px центрируется, иначе на широком экране она
          жалась бы к левому краю с пустотой справа. Подложка заголовка при
          этом остаётся во всю ширину, как у остальных секций сайта. */}
      <div className="pad-x pad-t border-b border-line bg-cool pb-[32px]">
        <div className="mx-auto w-full max-w-[956px]">
          <div className="eyebrow mb-[12px] text-muted">Покупателю</div>
          <h1 className="h1-hero">{page.h1}</h1>
        </div>
      </div>

      <div className="pad-x pad-y">
        <div className="mx-auto w-full max-w-[956px]">
          <ArticleBody page={page} tocLabel="Разделы" ariaLabel={`Разделы страницы «${page.h1}»`} />
        </div>
      </div>
    </>
  );
}
