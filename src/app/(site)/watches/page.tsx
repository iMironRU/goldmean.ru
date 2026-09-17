import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { BrandTiles } from "@/components/catalog/BrandTiles";
import { MasterTeaser } from "@/components/catalog/MasterTeaser";
import { WatchCatalog } from "@/components/catalog/WatchCatalog";
import { WATCH_FORMS, watches } from "@/lib/content/catalog";

export const metadata: Metadata = {
  title: watches.title,
  description: watches.lead,
};

export default function WatchesPage() {
  const counts: Record<string, number> = {};
  for (const m of watches.models) counts[m.brand] = (counts[m.brand] ?? 0) + 1;

  return (
    <>
      <div className="pad-x pad-t border-b border-line bg-cool pb-[32px]">
        <div className="eyebrow mb-[12px] text-muted">{watches.eyebrow}</div>
        <h1 className="h1-hero" style={{ lineHeight: 1 }}>
          {watches.title}
        </h1>
        <p className="mt-[16px] max-w-[520px] text-[14px] leading-[1.6] text-muted">
          {watches.lead}
        </p>
        <BrandTiles
          brands={watches.brands}
          counts={counts}
          forms={WATCH_FORMS}
          base="/watches"
          minWidth={160}
        />
      </div>

      {/* Suspense обязателен: фильтры живут в адресе, а при статическом
          экспорте сервер query не знает. */}
      <Suspense fallback={<div className="pad-x py-[40px] text-[13px] text-muted">Загружаем каталог…</div>}>
        <WatchCatalog models={watches.models} />
      </Suspense>

      <MasterTeaser />

      {/* Ссылка на украшения — на случай, если человек зашёл не туда. */}
      <div className="pad-x border-t border-line py-[24px] text-[13px] text-muted">
        Ищете украшения с бриллиантами?{" "}
        <Link href="/jewelry" className="text-ink underline underline-offset-4">
          Каталог украшений
        </Link>
      </div>
    </>
  );
}
