import Link from "next/link";
import { BrandLink } from "@/components/catalog/BrandLink";
import { ImageSlot } from "@/components/ImageSlot";
import { jewelBrandHref, type JewelItem } from "@/lib/content/catalog";

// Карточка изделия (§7 хендоффа). Фото 4:5 на тёплой подложке, камень
// отдельной строкой, цена рядом с названием.
export function JewelCard({ item }: { item: JewelItem }) {
  const note = `${item.brand} — ${item.name} (арт. ${item.article})`;
  const href = `/jewelry/${item.id}`;

  return (
    <div className="flex flex-col">
      <Link href={href} className="block aspect-4/5 bg-warm2">
        <ImageSlot photo={`Макро: ${item.name}, игра света в камне`} tone="warm" />
      </Link>

      <BrandLink
        name={item.brand}
        href={jewelBrandHref(item.brand)}
        className="mt-[14px] block text-[11px] uppercase tracking-[.14em] text-muted"
      />
      <div className="mt-[4px] flex items-baseline justify-between gap-[12px]">
        <Link href={href} className="font-display text-[26px] leading-[1.1] text-ink transition-colors hover:text-accent">
          {item.name}
        </Link>
        <span className="shrink-0 text-[12px] whitespace-nowrap text-muted">{item.price}</span>
      </div>
      <div className="mt-[6px] text-[13px] leading-[1.6] text-muted">{item.stone}</div>
      <div className="mt-[8px] text-[11px] tracking-[.04em] text-accent">
        ✓ Оригинал · сертификат на камень
      </div>
      <Link
        href={`/contacts?note=${encodeURIComponent(note)}`}
        className="mt-[12px] self-start border-b border-ink pb-[3px] text-[11px] font-medium uppercase tracking-[.1em] text-ink"
      >
        Записаться на просмотр
      </Link>
    </div>
  );
}

export default JewelCard;
