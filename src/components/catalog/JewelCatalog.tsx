"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FilterChips } from "@/components/catalog/FilterChips";
import { GuaranteeBlock } from "@/components/catalog/GuaranteeBlock";
import { JewelCard } from "@/components/catalog/JewelCard";
import {
  JEWEL_FORMS,
  JEWEL_TYPE_CHIPS,
  OCCASION_CHIPS,
  countLabel,
  jewelry,
  type JewelItem,
} from "@/lib/content/catalog";

// Фильтруемая часть каталога украшений. См. комментарий в WatchCatalog —
// устройство то же, отличаются фильтры и подписи.
export function JewelCatalog({
  items,
  brandName,
}: {
  items: JewelItem[];
  brandName?: string;
}) {
  const params = useSearchParams();
  const type = params.get("type") ?? "all";
  const occasion = params.get("occasion") ?? "all";

  const shown = items.filter(
    (j) =>
      (type === "all" || j.type === type) &&
      (occasion === "all" || j.occasions.includes(occasion)),
  );

  return (
    <>
      <FilterChips
        groups={[
          { param: "type", label: "Тип", chips: JEWEL_TYPE_CHIPS },
          { param: "occasion", label: "Повод", chips: OCCASION_CHIPS },
        ]}
        result={shown.length ? countLabel(shown.length, JEWEL_FORMS) : "Нет изделий"}
      />

      {shown.length > 0 ? (
        <>
          <div className="pad-x grid-fill gap-[40px_24px] pt-[32px] pb-[24px] [--col-min:280px]">
            {shown.map((j) => (
              <JewelCard key={j.id} item={j} />
            ))}
          </div>
          <p className="pad-x max-w-[560px] text-[13px] leading-[1.6] text-muted">
            {jewelry.priceNote}
          </p>
          <div className="pad-x mt-[24px] max-w-[720px] pb-[40px]">
            <GuaranteeBlock {...jewelry.guarantee} />
          </div>
        </>
      ) : (
        <div className="pad-x max-w-[560px] pt-[64px] pb-[96px]">
          <div className="h2-sec">{jewelry.empty.title}</div>
          <p className="mt-[14px] text-[14px] leading-[1.6] text-muted">
            {jewelry.empty.text.replace("{brand}", brandName ?? "этого производителя")}
          </p>
          <div className="mt-[24px] flex flex-wrap gap-[12px]">
            <Link href="/contacts" className="btn-primary px-[24px] py-[14px]">
              Уточнить наличие
            </Link>
            <Link
              href="/jewelry"
              className="inline-flex min-h-[44px] items-center rounded-[3px] border border-line2 px-[24px] py-[14px] text-[12px] font-medium uppercase tracking-[.1em] text-ink transition-colors hover:border-ink"
            >
              Все производители
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default JewelCatalog;
