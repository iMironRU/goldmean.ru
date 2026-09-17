import Link from "next/link";
import { BrandLink } from "@/components/catalog/BrandLink";
import { ImageSlot } from "@/components/ImageSlot";

export type RelatedItem = {
  key: string;
  href: string;
  brand?: string;
  /** Адрес страницы марки: подпись марки тоже должна быть ссылкой. */
  brandHref?: string;
  name: string;
  price: string;
  photo: string;
};

// Блок «Ещё у марки» под карточкой товара (§7 хендоффа).
export function RelatedGrid({
  title,
  items,
  tone,
}: {
  title: string;
  items: RelatedItem[];
  tone: "cool" | "warm";
}) {
  if (!items.length) return null;

  return (
    <div className="pad-x pb-[56px]">
      <div className="eyebrow mb-[16px] text-muted">{title}</div>
      <div className="grid-fill gap-[16px] [--col-min:180px]">
        {items.map((it) => (
          // Ссылка на марку не может лежать внутри ссылки на товар —
          // вложенные ссылки недопустимы. Поэтому карточка не обёрнута
          // целиком: кликабельны фото, название и подпись марки по
          // отдельности.
          <div key={it.key}>
            <Link href={it.href} className="block">
              <div className={`aspect-square ${tone === "warm" ? "bg-warm2" : "bg-cool"}`}>
                <ImageSlot photo={it.photo} tone={tone} />
              </div>
            </Link>
            {it.brand ? (
              <BrandLink
                name={it.brand}
                href={it.brandHref}
                className="mt-[10px] block text-[11px] uppercase tracking-[.12em] text-muted"
              />
            ) : null}
            <Link
              href={it.href}
              className={`block font-display text-[20px] leading-[1.15] text-ink ${it.brand ? "mt-[2px]" : "mt-[10px]"}`}
            >
              {it.name}
            </Link>
            <div className="text-[12px] text-muted">{it.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RelatedGrid;
