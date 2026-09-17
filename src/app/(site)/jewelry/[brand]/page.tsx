import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BrandHeader } from "@/components/catalog/BrandHeader";
import { JewelCatalog } from "@/components/catalog/JewelCatalog";
import { TelegramFeed } from "@/components/catalog/TelegramFeed";
import { brandBySlug, jewelry } from "@/lib/content/catalog";

type Params = { brand: string };

export function generateStaticParams(): Params[] {
  return jewelry.brands.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { brand } = await params;
  const b = brandBySlug(jewelry.brands, brand);
  if (!b) return {};
  return {
    title: `${b.name} — украшения с бриллиантами`,
    description: b.text,
  };
}

export default async function JewelBrandPage({ params }: { params: Promise<Params> }) {
  const { brand } = await params;
  const b = brandBySlug(jewelry.brands, brand);
  if (!b) notFound();

  const items = jewelry.items.filter((j) => j.brand === b.name);

  return (
    <>
      <BrandHeader
        brand={b}
        base="/jewelry"
        rootLabel={jewelry.title}
        bookLabel="Записаться на просмотр"
        allLabel="Все производители"
        tone="warm"
      />

      <Suspense fallback={<div className="pad-x py-[40px] text-[13px] text-muted">Загружаем изделия…</div>}>
        <JewelCatalog items={items} brandName={b.name} />
      </Suspense>

      <TelegramFeed />
    </>
  );
}
