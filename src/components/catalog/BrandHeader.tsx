import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";
import type { Brand } from "@/lib/content/catalog";

// Шапка страницы марки: хлебные крошки, логотип, название, справка о марке и
// имиджевое фото (§7 хендоффа). Один и тот же экран для часов и украшений,
// отличаются подложка и подписи.
export function BrandHeader({
  brand,
  base,
  rootLabel,
  bookLabel,
  allLabel,
  tone,
}: {
  brand: Brand;
  base: string;
  rootLabel: string;
  bookLabel: string;
  allLabel: string;
  tone: "cool" | "warm";
}) {
  const bg = tone === "warm" ? "bg-warm" : "bg-cool";

  return (
    <div className={bg}>
      <div className="pad-x flex gap-[8px] pt-[20px] text-[12px] text-muted">
        <Link href={base} className="text-muted transition-colors hover:text-ink">
          {rootLabel}
        </Link>
        <span>/</span>
        <span className="text-ink">{brand.name}</span>
      </div>

      <div className="pad-x grid-auto items-center gap-[40px] border-b border-line pt-[32px] pb-[40px] desktop:pb-[72px] [--col-min:300px]">
        <div>
          <div className="h-[72px] w-[220px] max-w-full">
            <ImageSlot photo={`Логотип ${brand.name}`} src={brand.logo} tone={tone} fit="contain" />
          </div>
          <h1 className="h1-hero mt-[20px]" style={{ lineHeight: 1 }}>
            {brand.name}
          </h1>
          <div className="mt-[12px] text-[12px] uppercase tracking-[.14em] text-muted">
            {brand.meta}
          </div>
          <p className="mt-[16px] max-w-[480px] text-[15px] leading-[1.65] text-muted">
            {brand.text}
          </p>
          <div className="mt-[24px] flex flex-wrap gap-[10px]">
            <Link href="/contacts" className="btn-primary px-[24px] py-[14px]">
              {bookLabel}
            </Link>
            <Link
              href={base}
              className="inline-flex min-h-[44px] items-center rounded-[3px] border border-line2 px-[24px] py-[14px] text-[12px] font-medium uppercase tracking-[.1em] text-ink transition-colors hover:border-ink"
            >
              {allLabel}
            </Link>
          </div>
        </div>

        <div className={`aspect-4/3 ${tone === "warm" ? "bg-warm2" : "bg-cool2"}`}>
          <ImageSlot
            photo={`Имиджевое фото ${brand.name} от ${tone === "warm" ? "производителя" : "бренда"}`}
            tone={tone}
          />
        </div>
      </div>
    </div>
  );
}

export default BrandHeader;
