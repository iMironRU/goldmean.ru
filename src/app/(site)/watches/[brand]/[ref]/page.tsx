import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrandLink } from "@/components/catalog/BrandLink";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { GuaranteeBlock } from "@/components/catalog/GuaranteeBlock";
import { RelatedGrid } from "@/components/catalog/RelatedGrid";
import { SpecTable } from "@/components/catalog/SpecTable";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { ImageSlot } from "@/components/ImageSlot";
import { photosFor } from "@/lib/content/photos";
import { site } from "@/lib/content/site";
import {
  brandByName,
  brandBySlug,
  formatPrice,
  modelByRef,
  refSlug,
  relatedModels,
  watchSpecs,
  watches,
} from "@/lib/content/catalog";

type Params = { brand: string; ref: string };

export function generateStaticParams(): Params[] {
  return watches.models.flatMap((m) => {
    const b = brandByName(watches.brands, m.brand);
    return b ? [{ brand: b.slug, ref: refSlug(m.ref) }] : [];
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { ref } = await params;
  const m = modelByRef(ref);
  if (!m) return {};
  return {
    title: `${m.brand} ${m.name}`,
    description: `${m.brand} ${m.name}, референс ${m.ref}. ${m.caliber}. Примерка в салоне «Золотая середина», Оренбург.`,
  };
}

export default async function WatchPage({ params }: { params: Promise<Params> }) {
  const { brand, ref } = await params;
  const b = brandBySlug(watches.brands, brand);
  const m = modelByRef(ref);
  // Референс чужой марки в адресе — не эта страница.
  if (!b || !m || m.brand !== b.name) notFound();

  const d = watches.detail;
  const photos = photosFor(m.id);
  const note = `${m.brand} ${m.name} (${m.ref})`;
  const bookHref = `/contacts?note=${encodeURIComponent(note)}`;

  return (
    <>
      <Breadcrumbs
        items={[
          { href: "/watches", label: watches.title },
          { href: `/watches/${b.slug}`, label: m.brand },
          { label: m.name },
        ]}
      />

      <div className="pad-x grid-auto gap-[40px] pt-[24px] pb-[64px]">
        <div>
          {/* Снимков нет — остаётся плейсхолдер с описанием нужного кадра, и
              страница целиком статическая. Галерея (клиентская, с
              переключением ракурсов) появляется только вместе с фотографиями. */}
          {photos.length > 0 ? (
            <ProductGallery photos={photos} alt={`${m.brand} ${m.name}`} tone="cool" />
          ) : (
            <div className="aspect-square bg-cool">
              <ImageSlot photo={`Основной ракурс: ${m.brand} ${m.name}`} tone="cool" />
            </div>
          )}

          <p className="mt-[10px] text-[12px] leading-[1.5] text-muted">{d.photoNote}</p>
        </div>

        <div>
          <BrandLink
            name={m.brand}
            href={`/watches/${b.slug}`}
            className="eyebrow block text-muted"
          />
          <h1 className="h2-sec mt-[8px]">{m.name}</h1>
          <div className="mt-[8px] font-mono text-[12px] text-muted">Референс {m.ref}</div>

          <div className="mt-[24px] text-[22px]">{formatPrice(m.price)}</div>
          <div className="mt-[4px] text-[12px] text-muted">{d.availability}</div>

          {/* На мобильном кнопки во всю ширину столбиком, на десктопе в
              строку. При переносе они обжимались по своему тексту и ряд
              получался рваным. */}
          <div className="mt-[24px] flex flex-col items-stretch gap-[10px] desktop:flex-row desktop:flex-wrap desktop:items-center">
            <Link href={bookHref} data-page-cta className="btn-primary desktop:flex-auto">
              {site.cta.label}
            </Link>
            <Link
              href={bookHref}
              className="inline-flex min-h-[48px] items-center justify-center rounded-[3px] border border-ink px-[20px] text-[12px] font-medium uppercase tracking-[.1em] text-ink"
            >
              {d.ask}
            </Link>
          </div>

          <SpecTable specs={watchSpecs(m)} />

          <Link href="/info/harakteristiki" className="link-action mt-[16px]">
            Что означают характеристики
          </Link>

          <div className="mt-[24px]">
            <GuaranteeBlock {...watches.guarantee} />
          </div>

          <p className="mt-[24px] text-[14px] leading-[1.7] text-muted">{d.about}</p>
        </div>
      </div>

      <RelatedGrid
        title={d.relatedTitle.replace("{brand}", m.brand)}
        tone="cool"
        items={relatedModels(m).map((r) => {
          const rb = brandByName(watches.brands, r.brand);
          return {
            key: r.id,
            href: `/watches/${rb?.slug ?? ""}/${refSlug(r.ref)}`,
            name: r.name,
            price: formatPrice(r.price),
            photo: r.name,
          };
        })}
      />
    </>
  );
}
