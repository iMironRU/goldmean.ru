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
  anchor,
}: {
  brand: Brand;
  base: string;
  rootLabel: string;
  bookLabel: string;
  allLabel: string;
  tone: "cool" | "warm";
  /**
   * Необязательная третья кнопка — переход к блоку на этой же странице.
   * У производителей украшений это лента «Что сейчас в витрине»: она стоит
   * в самом низу, и без кнопки о ней никто не узнает. У часовых марок такого
   * блока нет, поэтому кнопка не показывается.
   */
  anchor?: { href: string; label: string };
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
        <div className="@container">
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
          {/* Кнопки одинаковой ширины — по самой широкой надписи: w-fit
              сжимает сетку до неё, auto-cols-fr уравнивает колонки.

              В ряд — только когда ряд помещается в колонку шапки целиком
              (контейнерный запрос по @container выше), иначе столбиком. Три
              кнопки по 240 px — это 740 px, а колонка на 1280 px — 557: на
              ноутбуке ряд переносился как 2+1 кнопками разной ширины, и
              столбик одинаковых читается ровнее ломаного ряда. На мониторе
              от ~1650 px колонка шире, и ряд встаёт сам. Двум кнопкам (у
              часовых марок) хватает 490 px — у них ряд уже с 1280, как в
              прототипе. Порог считается от ширины КОЛОНКИ, а не окна:
              переставят сетку шапки — не сломается. Классы порога записаны
              целиком, а не склеены из числа: Tailwind находит их по тексту.

              Во всю ширину колонки не растягиваем — это сломало бы пропорции
              макета, где кнопки обжаты по тексту, и «Все производители»
              выглядела бы главным действием, хотя это возврат к списку. */}
          <div
            className={`mt-[24px] grid w-full gap-[10px] desktop:w-fit ${
              anchor
                ? "@min-[760px]:grid-flow-col @min-[760px]:auto-cols-fr"
                : "@min-[510px]:grid-flow-col @min-[510px]:auto-cols-fr"
            }`}
          >
            <Link href="/contacts" data-page-cta className="btn-primary px-[24px] py-[14px]">
              {bookLabel}
            </Link>
            {anchor && (
              // Обычный <a>: это переход по якорю внутри страницы, basePath
              // ему не нужен. Плавность даёт scroll-behavior в globals.css.
              <a
                href={anchor.href}
                className="inline-flex min-h-[44px] items-center justify-center rounded-[3px] border border-line2 px-[24px] py-[14px] text-[12px] font-medium uppercase tracking-[.1em] text-ink transition-colors hover:border-ink"
              >
                {anchor.label}
              </a>
            )}
            <Link
              href={base}
              className="inline-flex min-h-[44px] items-center justify-center rounded-[3px] border border-line2 px-[24px] py-[14px] text-[12px] font-medium uppercase tracking-[.1em] text-ink transition-colors hover:border-ink"
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
