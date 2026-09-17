import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BrandArticle } from "@/components/catalog/BrandArticle";
import { BrandHeader } from "@/components/catalog/BrandHeader";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { GuaranteeBlock } from "@/components/catalog/GuaranteeBlock";
import { JewelCatalog } from "@/components/catalog/JewelCatalog";
import { RelatedGrid } from "@/components/catalog/RelatedGrid";
import { SpecTable } from "@/components/catalog/SpecTable";
import { TelegramFeed } from "@/components/catalog/TelegramFeed";
import { ImageSlot } from "@/components/ImageSlot";
import { getBrandArticle } from "@/lib/content/markdown-page";
import {
  brandByName,
  brandBySlug,
  jewelSpecs,
  jewelry,
  relatedJewels,
} from "@/lib/content/catalog";

// Один сегмент на два экрана — так требует §4 хендоффа: и страница
// производителя (/jewelry/:brand), и карточка изделия (/jewelry/:id) лежат
// прямо под /jewelry. В маршрутизаторе это один и тот же динамический
// сегмент, поэтому решаем здесь: слаг производителя или артикул изделия.
type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return [
    ...jewelry.brands.map((b) => ({ slug: b.slug })),
    ...jewelry.items.map((j) => ({ slug: j.id })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const b = brandBySlug(jewelry.brands, slug);
  if (b) {
    // seo_title из контент-пакета уже содержит «| Золотая середина», поэтому
    // absolute — иначе шаблон корневого layout добавит название второй раз.
    const article = getBrandArticle("jewelry", b.slug);
    if (article?.seoTitle) {
      return {
        title: { absolute: article.seoTitle },
        description: article.seoDescription || b.text,
      };
    }
    return { title: `${b.name} — украшения с бриллиантами`, description: b.text };
  }

  const j = jewelry.items.find((x) => x.id === slug);
  if (j) {
    return {
      title: `${j.name} — ${j.brand}`,
      description: `${j.name}, ${j.brand}, артикул ${j.article}. ${j.stone}. Просмотр в салоне «Золотая середина», Оренбург.`,
    };
  }
  return {};
}

export default async function JewelrySlugPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  const brand = brandBySlug(jewelry.brands, slug);
  if (brand) {
    const items = jewelry.items.filter((j) => j.brand === brand.name);
    const article = getBrandArticle("jewelry", brand.slug);
    return (
      <>
        <BrandHeader
          brand={brand}
          base="/jewelry"
          rootLabel={jewelry.title}
          bookLabel="Записаться на просмотр"
          allLabel="Все производители"
          tone="warm"
        />
        <Suspense fallback={<div className="pad-x py-[40px] text-[13px] text-muted">Загружаем изделия…</div>}>
          <JewelCatalog items={items} brandName={brand.name} />
        </Suspense>
        {article ? <BrandArticle article={article} brandName={brand.name} /> : null}

        <TelegramFeed />
      </>
    );
  }

  const j = jewelry.items.find((x) => x.id === slug);
  if (!j) notFound();

  const d = jewelry.detail;
  const itemBrand = brandByName(jewelry.brands, j.brand);
  const note = `${j.brand} — ${j.name} (арт. ${j.article})`;
  const bookHref = `/contacts?note=${encodeURIComponent(note)}`;

  return (
    <>
      <Breadcrumbs
        items={[
          { href: "/jewelry", label: jewelry.title },
          ...(itemBrand ? [{ href: `/jewelry/${itemBrand.slug}`, label: j.brand }] : []),
          { label: j.name },
        ]}
      />

      <div className="pad-x grid-auto gap-[40px] pt-[24px] pb-[64px]">
        <div>
          <div className="aspect-4/5 bg-warm2">
            <ImageSlot photo={`Макро: ${j.brand} ${j.name}, игра света в камне`} tone="warm" />
          </div>
          <p className="mt-[10px] text-[12px] leading-[1.5] text-muted">{d.photoNote}</p>
        </div>

        <div>
          <div className="eyebrow text-muted">{j.brand}</div>
          <h1 className="h2-sec mt-[8px]">{j.name}</h1>
          <div className="mt-[8px] font-mono text-[12px] text-muted">Артикул {j.article}</div>

          <div className="mt-[24px] text-[22px]">{j.price}</div>
          <div className="mt-[4px] text-[12px] text-muted">{d.availability}</div>

          <div className="mt-[24px] flex flex-wrap gap-[10px]">
            <Link href={bookHref} className="btn-primary flex-auto">
              {d.book}
            </Link>
            <Link
              href={bookHref}
              className="inline-flex min-h-[44px] items-center justify-center rounded-[3px] border border-ink px-[22px] py-[16px] text-[12px] font-medium uppercase tracking-[.1em] text-ink"
            >
              {d.ask}
            </Link>
          </div>

          <SpecTable specs={jewelSpecs(j)} />

          <div className="mt-[24px]">
            <GuaranteeBlock {...jewelry.guarantee} />
          </div>

          <Link href="/diamonds" className="link-action mt-[24px]">
            {d.diamondsLink}
          </Link>
        </div>
      </div>

      <RelatedGrid
        // Родительный падеж: «Ещё у Смоленских бриллиантов», а не «у
        // Смоленские бриллианты». Шаблон в прототипе рассчитан на латинские
        // названия, которые не склоняются.
        title={d.relatedTitle.replace("{brand}", itemBrand?.genitive ?? j.brand)}
        tone="warm"
        items={relatedJewels(j).map((r) => ({
          key: r.id,
          href: `/jewelry/${r.id}`,
          brand: r.brand,
          name: r.name,
          price: r.price,
          photo: r.name,
        }))}
      />
    </>
  );
}
