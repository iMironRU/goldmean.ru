import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BrandHeader } from "@/components/catalog/BrandHeader";
import { MasterTeaser } from "@/components/catalog/MasterTeaser";
import { WatchCatalog } from "@/components/catalog/WatchCatalog";
import { brandBySlug, watches } from "@/lib/content/catalog";

type Params = { brand: string };

// Статический экспорт: список страниц марок известен на сборке.
export function generateStaticParams(): Params[] {
  return watches.brands.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { brand } = await params;
  const b = brandBySlug(watches.brands, brand);
  if (!b) return {};
  return {
    title: `${b.name} — часы`,
    description: b.text,
  };
}

export default async function WatchBrandPage({ params }: { params: Promise<Params> }) {
  const { brand } = await params;
  const b = brandBySlug(watches.brands, brand);
  if (!b) notFound();

  const models = watches.models.filter((m) => m.brand === b.name);

  return (
    <>
      <BrandHeader
        brand={b}
        base="/watches"
        rootLabel={watches.title}
        bookLabel="Записаться на примерку"
        allLabel="Все марки"
        tone="cool"
      />

      <Suspense fallback={<div className="pad-x py-[40px] text-[13px] text-muted">Загружаем модели…</div>}>
        <WatchCatalog models={models} brandName={b.name} />
      </Suspense>

      <MasterTeaser />
    </>
  );
}
