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
  /**
   * Минимальная ширина плитки на мобильном. Держать не больше 163 px:
   * §11 хендоффа требует минимум две колонки марок на 390 px. Считать надо
   * не от 390, а от 335 — в десктопном браузере на узком окне полоса
   * прокрутки съедает ещё 15 px, и на 170 вторая колонка уже отваливалась.
   */
  minWidth: number;
  activeSlug?: string;
}) {
  return (
    // Ширина плитки: мобильное значение приходит пропом, десктопное задаёт
    // класс .brand-tiles в globals.css — см. комментарий там.
    <div
      className="grid-fill brand-tiles mt-[32px] gap-[8px]"
      style={{ ["--col-min-narrow" as string]: `${minWidth}px` }}
    >
      {brands.map((b) => {
        const active = b.slug === activeSlug;
        return (
          // Ссылка — вся плитка, а не только полоска с названием: логотип
          // занимает большую часть плитки, и нажатие по нему ничего не
          // делало. Внутри больше нет ссылок, так что вложенных не будет.
          <Link
            key={b.slug}
            href={`${base}/${b.slug}`}
            aria-current={active ? "page" : undefined}
            className="flex min-w-0 flex-col overflow-hidden border bg-bg transition-colors hover:!border-ink"
            style={{ borderColor: active ? "var(--ink)" : "var(--line2)" }}
          >
            {/* Поля вокруг логотипа со всех сторон: логотип вписывается
                (contain) во всё, что ему дали, и без полей широкие упирались
                в бока плитки, высокие — в верх, а все — в линию под собой. */}
            <div className="h-[92px] px-[20px] py-[16px]">
              <ImageSlot photo={`Логотип ${b.name}`} src={b.logo} fit="contain" />
            </div>
            <div
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
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default BrandTiles;
