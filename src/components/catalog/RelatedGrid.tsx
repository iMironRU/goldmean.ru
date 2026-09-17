import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";

export type RelatedItem = {
  key: string;
  href: string;
  brand?: string;
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
          <Link key={it.key} href={it.href} className="block text-ink">
            <div className={`aspect-square ${tone === "warm" ? "bg-warm2" : "bg-cool"}`}>
              <ImageSlot photo={it.photo} tone={tone} />
            </div>
            {it.brand ? (
              <div className="mt-[10px] text-[11px] uppercase tracking-[.12em] text-muted">
                {it.brand}
              </div>
            ) : null}
            <div className={`font-display text-[20px] leading-[1.15] ${it.brand ? "mt-[2px]" : "mt-[10px]"}`}>
              {it.name}
            </div>
            <div className="text-[12px] text-muted">{it.price}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RelatedGrid;
