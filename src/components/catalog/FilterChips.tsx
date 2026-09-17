"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export type ChipGroup = {
  /** Имя параметра в адресе: gender, mech, type, occasion. */
  param: string;
  label: string;
  chips: { key: string; label: string }[];
};

// Фильтры каталога. Состояние держим в адресе (§9 хендоффа): ссылку на
// отфильтрованную выдачу должно быть можно переслать.
//
// Чипы — настоящие ссылки, а не кнопки: работает средний клик, «открыть в
// новой вкладке» и копирование адреса. scroll={false} — чтобы страница не
// прыгала в начало при смене фильтра.
export function FilterChips({ groups, result }: { groups: ChipGroup[]; result: string }) {
  const pathname = usePathname();
  const params = useSearchParams();

  const hrefFor = (param: string, key: string) => {
    const next = new URLSearchParams(params.toString());
    if (key === "all") next.delete(param);
    else next.set(param, key);
    const q = next.toString();
    return q ? `${pathname}?${q}` : pathname;
  };

  return (
    <div className="filters-sticky pad-x flex flex-wrap items-center gap-[12px_32px] border-b border-line py-[20px]">
      {groups.map((g) => {
        const current = params.get(g.param) ?? "all";
        return (
          <div key={g.param} className="flex flex-wrap items-center gap-[6px]">
            <span className="mr-[6px] text-[11px] uppercase tracking-[.1em] text-muted">
              {g.label}
            </span>
            {g.chips.map((c) => (
              <Link
                key={c.key}
                href={hrefFor(g.param, c.key)}
                scroll={false}
                aria-current={c.key === current ? "true" : undefined}
                className="chip"
              >
                {c.label}
              </Link>
            ))}
          </div>
        );
      })}
      <div className="ml-auto text-[12px] text-muted">{result}</div>
    </div>
  );
}

export default FilterChips;
