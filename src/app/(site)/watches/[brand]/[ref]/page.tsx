import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { GuaranteeBlock } from "@/components/catalog/GuaranteeBlock";
import { RelatedGrid } from "@/components/catalog/RelatedGrid";
import { SpecTable } from "@/components/catalog/SpecTable";
import { ImageSlot } from "@/components/ImageSlot";
import { photosFor } from "@/lib/content/photos";
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
          <div className="aspect-square bg-cool">
            <ImageSlot
              photo={`Основной ракурс: ${m.brand} ${m.name}`}
              src={photos[0]}
              tone="cool"
            />
          </div>

          {/* Остальные ракурсы. В прототипе слот один — ряд превью появляется
              только когда снимков действительно несколько. */}
          {photos.length > 1 && (
            <div className="mt-[8px] grid grid-cols-4 gap-[8px]">
              {photos.slice(1, 5).map((src) => (
                <div key={src} className="aspect-square bg-cool">
                  <ImageSlot photo={`${m.brand} ${m.name}`} src={src} tone="cool" />
                </div>
              ))}
            </div>
          )}

          <p className="mt-[10px] text-[12px] leading-[1.5] text-muted">{d.photoNote}</p>
        </div>

        <div>
          <div className="eyebrow text-muted">{m.brand}</div>
          <h1 className="h2-sec mt-[8px]">{m.name}</h1>
          <div className="mt-[8px] font-mono text-[12px] text-muted">Референс {m.ref}</div>

          <div className="mt-[24px] text-[22px]">{formatPrice(m.price)}</div>
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
