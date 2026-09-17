import type { Metadata } from "next";
import Link from "next/link";
import { VariantThumb } from "@/components/preview/VariantThumb";
import { preview, site } from "@/lib/content/site";

export const metadata: Metadata = {
  // absolute — иначе шаблон корневого layout добавит второе «Золотая середина».
  title: { absolute: `${preview.title} · ${site.name}` },
  description: preview.lead,
  // Страница показа, не для поисковиков.
  robots: { index: false, follow: false },
};

// Страница выбора варианта главной.
//
// Ссылка, которую отправляют заказчику: он видит три варианта рядом, живыми,
// и открывает любой. Частью сайта не является — в §4 хендоффа такого маршрута
// нет, и перед релизом каталог src/app/preview удаляется целиком.
export default function PreviewPage() {
  return (
    <div className="pad-x pad-y min-h-screen">
      <div className="eyebrow mb-[14px] text-accent">{site.name} · MVP</div>
      <h1 className="h1-hero max-w-[820px]">{preview.title}</h1>
      <p className="mt-[24px] max-w-[640px] text-[15px] leading-[1.65] text-muted">
        {preview.lead}
      </p>

      <div className="grid-auto mt-[40px] gap-[32px] [--col-min:300px]">
        {preview.variants.map((v) => (
          <div key={v.key} className="relative flex flex-col">
            <VariantThumb variant={v.key} />

            <div className="mt-[18px] flex items-baseline justify-between gap-[16px] border-b border-ink pb-[12px]">
              <span className="h3-card text-ink">
                {v.key.toUpperCase()} · {v.name}
              </span>
              <span className="shrink-0 text-[12px] font-medium uppercase tracking-[.1em] text-ink">
                Смотреть →
              </span>
            </div>

            <p className="mt-[12px] text-[14px] leading-[1.6] text-muted">{v.text}</p>

            {/* Кликабельна вся карточка, а не только подпись. */}
            <Link
              href={`/?home=${v.key}`}
              className="absolute inset-0"
              aria-label={`Смотреть вариант ${v.key.toUpperCase()} — ${v.name}`}
            />
          </div>
        ))}
      </div>

      <p className="mt-[48px] border-t border-line pt-[20px] text-[13px] text-muted">
        {preview.note}
      </p>
    </div>
  );
}
