import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";
import { home, site } from "@/lib/content/site";

// Вариант «c» — витрина. Тёмный блок-манифест, ниже две широкие секции-полосы
// 3:2 с нумерацией 01/02 (§3.1).
//
// На мобильном во второй секции меняется порядок (order), чтобы фото шло
// перед текстом (§11).
export function HomeVariantC() {
  const v = home.c;

  return (
    <>
      <div className="pad-x pad-y bg-ink text-bg">
        <div className="eyebrow mb-[20px] opacity-60">{v.eyebrow}</div>
        <h1 className="h1-hero max-w-[820px]">{v.title}</h1>
        <div className="mt-[28px] flex flex-wrap items-center gap-[12px]">
          <Link href={site.cta.href} className="btn-primary btn-primary-inv">
            {site.cta.label}
          </Link>
          <Link
            href="/why-offline"
            className="border-b border-[rgba(250,249,247,.4)] text-[13px] text-bg opacity-75"
          >
            {v.secondaryLink}
          </Link>
        </div>
      </div>

      <Link href="/watches" className="grid-auto border-b border-line">
        <div className="aspect-3/2 bg-cool">
          <ImageSlot photo={v.watches.photo} tone="cool" />
        </div>
        <div className="pad-x flex flex-col justify-center gap-[14px] py-[20px] desktop:py-[56px]">
          <div className="eyebrow text-muted">{v.watches.number}</div>
          <div className="h2-sec text-ink">{v.watches.title}</div>
          <div className="max-w-[420px] text-[14px] leading-[1.6] text-muted">
            {v.watches.text}
          </div>
          <div className="text-[12px] font-medium uppercase tracking-[.1em] text-ink">
            {v.watches.action}
          </div>
        </div>
      </Link>

      <Link href="/jewelry" className="grid-auto bg-warm">
        <div className="pad-x order-2 flex flex-col justify-center gap-[14px] py-[20px] desktop:order-none desktop:py-[56px]">
          <div className="eyebrow text-muted">{v.jewelry.number}</div>
          <div className="h2-sec text-ink">{v.jewelry.title}</div>
          <div className="max-w-[420px] text-[14px] leading-[1.6] text-muted">
            {v.jewelry.text}
          </div>
          <div className="text-[12px] font-medium uppercase tracking-[.1em] text-ink">
            {v.jewelry.action}
          </div>
        </div>
        <div className="aspect-3/2 order-1 bg-warm2 desktop:order-none">
          <ImageSlot photo={v.jewelry.photo} tone="warm" />
        </div>
      </Link>
    </>
  );
}

export default HomeVariantC;
