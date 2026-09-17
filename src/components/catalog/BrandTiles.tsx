import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";
import { countLabel, type Brand } from "@/lib/content/catalog";

// Плитка марок. Логотип берётся из brand.logo; у марок, чьих логотипов ещё
// нет (§12 п.1), на его месте остаётся слот с подписью, какой файл нужен.
export function BrandTiles({
  brands,
  counts,
  forms,
  base,
  minWidth,
  activeSlug,
}: {
  brands: Brand[];
  counts: Record<string, number>;
  forms: [string, string, string];
  /** Корень раздела: «/watches» или «/jewelry». */
  base: string;
  minWidth: number;
  activeSlug?: string;
}) {
  return (
    <div
      className="grid-fill mt-[32px] gap-[8px]"
      style={{ ["--col-min" as string]: `${minWidth}px` }}
    >
      {brands.map((b) => {
        const active = b.slug === activeSlug;
        return (
          <div
            key={b.slug}
            className="flex min-w-0 flex-col overflow-hidden border bg-bg"
            style={{ borderColor: active ? "var(--ink)" : "var(--line2)" }}
          >
            <div className="mx-[14px] mt-[10px] h-[56px]">
              <ImageSlot photo={`Логотип ${b.name}`} src={b.logo} fit="contain" />
            </div>
            <Link
              href={`${base}/${b.slug}`}
              className="flex min-w-0 flex-col items-center gap-[2px] border-t border-line px-[8px] pt-[8px] pb-[9px] transition-colors"
              style={{
                background: active ? "var(--ink)" : "transparent",
                color: active ? "var(--bg)" : "var(--ink)",
              }}
            >
              <span className="max-w-full text-center text-[11px] uppercase leading-[1.2] tracking-[.1em]">
                {b.name}
              </span>
              <span className="text-[10px] tracking-[.06em] opacity-60">
                {countLabel(counts[b.name] ?? 0, forms)}
              </span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default BrandTiles;
