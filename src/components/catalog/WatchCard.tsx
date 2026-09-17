import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";
import {
  brandByName,
  formatPrice,
  refSlug,
  watches,
  type WatchModel,
} from "@/lib/content/catalog";
import { tagsFor } from "@/lib/catalog-tags";

// Карточка модели часов (§6 хендоффа). Ярлыки характеристик лежат поверх
// фотографии, в левом нижнем углу; у каждого — title с полной формулировкой.
export function WatchCard({ model }: { model: WatchModel }) {
  const tags = tagsFor(model.mechanism, model.waterResistance, model.glass, model.case);
  const brand = brandByName(watches.brands, model.brand);
  const href = `/watches/${brand?.slug ?? ""}/${refSlug(model.ref)}`;
  // §7: кнопка записи переносит название модели в комментарий формы.
  const note = `${model.brand} ${model.name} (${model.ref})`;

  return (
    <div className="flex flex-col">
      <Link href={href} className="relative block aspect-square bg-cool">
        <ImageSlot photo={`Фото от бренда: ${model.brand} ${model.name}`} tone="cool" />
        <div className="pointer-events-none absolute inset-x-[8px] bottom-[8px] flex flex-wrap gap-[4px]">
          {tags.map((t) => (
            <span
              key={t.label}
              title={t.title}
              className="inline-flex items-center gap-[4px] rounded-[2px] px-[6px] py-[3px] text-[10px] uppercase leading-[1.2] tracking-[.06em] whitespace-nowrap"
              style={{
                background: t.dark ? "var(--ink)" : "var(--bg)",
                color: t.dark ? "var(--bg)" : "var(--ink)",
              }}
            >
              <svg viewBox="0 0 16 16" width="9" height="9" fill="currentColor" className="block flex-none opacity-90">
                <path d={t.icon} />
              </svg>
              {t.label}
            </span>
          ))}
        </div>
      </Link>

      <div className="mt-[14px] text-[11px] uppercase tracking-[.14em] text-muted">{model.brand}</div>
      <Link href={href} className="h3-card mt-[4px] block text-ink transition-colors hover:text-accent">
        {model.name}
      </Link>
      <div className="mt-[6px] font-mono text-[11px] text-muted">
        {model.ref} · {model.size} мм
      </div>
      <div className="mt-[8px] text-[11px] tracking-[.04em] text-accent">
        ✓ Оригинал · официальный дилер
      </div>

      <div className="mt-[12px] flex items-center justify-between gap-[12px] border-t border-line pt-[12px]">
        <span className="text-[14px]">{formatPrice(model.price)}</span>
        <Link
          href={`/contacts?note=${encodeURIComponent(note)}`}
          className="shrink-0 border-b border-ink pb-[2px] text-[11px] font-medium uppercase tracking-[.1em] text-ink"
        >
          Записаться на примерку
        </Link>
      </div>
    </div>
  );
}

export default WatchCard;
