"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FilterChips } from "@/components/catalog/FilterChips";
import { GuaranteeBlock } from "@/components/catalog/GuaranteeBlock";
import { WatchCard } from "@/components/catalog/WatchCard";
import {
  GENDER_CHIPS,
  MECH_CHIPS,
  countLabel,
  watches,
  WATCH_FORMS,
  type WatchModel,
} from "@/lib/content/catalog";

// Фильтруемая часть каталога часов: панель фильтров, сетка и блок гарантии.
//
// Клиентская, потому что состояние фильтров живёт в адресе (§9), а при
// статическом экспорте сервер query не знает. Список моделей приходит уже
// суженным до марки — фильтрация по полу и механизму идёт здесь.
export function WatchCatalog({
  models,
  brandName,
}: {
  models: WatchModel[];
  brandName?: string;
}) {
  const params = useSearchParams();
  const gender = params.get("gender") ?? "all";
  const mech = params.get("mech") ?? "all";

  const shown = models.filter(
    (m) =>
      (gender === "all" || m.gender === gender) &&
      (mech === "all" || m.mechanism === mech),
  );

  return (
    <>
      <FilterChips
        groups={[
          { param: "gender", label: "Пол", chips: GENDER_CHIPS },
          { param: "mech", label: "Механизм", chips: MECH_CHIPS },
        ]}
        result={shown.length ? countLabel(shown.length, WATCH_FORMS) : "Нет моделей"}
      />

      {shown.length > 0 ? (
        <div className="pad-x pt-[32px] pb-[56px]">
          <div className="grid-fill gap-[32px_24px] [--col-min:260px]">
            {shown.map((m) => (
              <WatchCard key={m.id} model={m} />
            ))}
          </div>
          <div className="mt-[32px] max-w-[720px]">
            <GuaranteeBlock {...watches.guarantee} />
          </div>
        </div>
      ) : (
        <div className="pad-x max-w-[560px] pt-[64px] pb-[96px]">
          <div className="h2-sec">{watches.empty.title}</div>
          <p className="mt-[14px] text-[14px] leading-[1.6] text-muted">
            {watches.empty.text.replace("{brand}", brandName ?? "этой марки")}
          </p>
          <div className="mt-[24px] flex flex-wrap gap-[12px]">
            <Link href="/contacts" className="btn-primary px-[24px] py-[14px]">
              Уточнить наличие
            </Link>
            <Link
              href="/watches"
              className="inline-flex min-h-[44px] items-center rounded-[3px] border border-line2 px-[24px] py-[14px] text-[12px] font-medium uppercase tracking-[.1em] text-ink transition-colors hover:border-ink"
            >
              Все марки
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default WatchCatalog;
