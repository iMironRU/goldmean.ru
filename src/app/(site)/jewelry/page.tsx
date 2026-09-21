import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { BrandTiles } from "@/components/catalog/BrandTiles";
import { JewelCatalog } from "@/components/catalog/JewelCatalog";
import { TelegramFeed } from "@/components/catalog/TelegramFeed";
import { JEWEL_FORMS, jewelry } from "@/lib/content/catalog";
import { site } from "@/lib/content/site";

export const metadata: Metadata = {
  title: jewelry.seoTitle,
  description: jewelry.seoDescription,
};

export default function JewelryPage() {
  const counts: Record<string, number> = {};
  for (const j of jewelry.items) counts[j.brand] = (counts[j.brand] ?? 0) + 1;

  return (
    <>
      <div className="pad-x pad-t border-b border-line bg-warm pb-[40px]">
        <div className="eyebrow mb-[12px] text-muted">{jewelry.eyebrow}</div>
        <h1 className="h1-hero max-w-[820px]" style={{ lineHeight: 1 }}>
          {jewelry.title} <em className="font-normal">{jewelry.titleEm}</em>
        </h1>
        <p className="mt-[18px] max-w-[520px] text-[15px] leading-[1.65] text-muted">
          {jewelry.lead}
        </p>

        <div className="mt-[28px] flex flex-wrap gap-[8px]">
          <Link
            href="/diamonds"
            className="inline-flex min-h-[48px] items-center rounded-[3px] border border-ink px-[20px] text-[12px] uppercase tracking-[.08em] text-ink"
          >
            О бриллиантах
          </Link>
          <a
            href={site.social.telegram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[48px] items-center rounded-[3px] border border-line2 px-[20px] text-[12px] uppercase tracking-[.08em] text-ink transition-colors hover:border-ink"
          >
            Живой ассортимент в Telegram
          </a>
        </div>

        <BrandTiles
          brands={jewelry.brands}
          counts={counts}
          forms={JEWEL_FORMS}
          base="/jewelry"
          minWidth={160}
        />
      </div>

      <Suspense fallback={<div className="pad-x py-[40px] text-[13px] text-muted">Загружаем каталог…</div>}>
        <JewelCatalog items={jewelry.items} />
      </Suspense>

      <TelegramFeed />
    </>
  );
}
