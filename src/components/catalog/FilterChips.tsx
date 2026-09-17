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
//
// Ровно по строке на группу, чипы внутри прокручиваются вбок. Раньше они
// переносились, и на телефоне панель разрасталась до четырёх рядов — 241 px,
// почти треть экрана. Горизонтальная прокрутка включается только когда чипы
// не помещаются: на десктопе они стоят в строку и ничего не прокручивается.
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
    <div className="filters-sticky pad-x flex flex-col gap-[8px] border-b border-line py-[16px]">
      {groups.map((g) => {
        const current = params.get(g.param) ?? "all";

        return (
          <div key={g.param} className="flex items-center gap-[10px]">
            <span className="w-[76px] shrink-0 text-[11px] uppercase tracking-[.1em] text-muted">
              {g.label}
            </span>

            {/* min-w-0 обязателен: без него флекс-элемент не даёт себя сжать
                по содержимому, и вместо прокрутки строка распирает панель. */}
            <div className="chips-scroll flex min-w-0 flex-1 gap-[6px] overflow-x-auto">
              {g.chips.map((c) => (
                <Link
                  key={c.key}
                  href={hrefFor(g.param, c.key)}
                  scroll={false}
                  aria-current={c.key === current ? "true" : undefined}
                  className="chip shrink-0"
                >
                  {c.label}
                </Link>
              ))}
            </div>

          </div>
        );
      })}

      {/* Счётчик — итог обоих фильтров, поэтому отдельной строкой под ними.
          В строке с чипами он отбирал бы у ленты 70 px из 197 на телефоне, и
          обрезанный чип упирался бы в него вплотную, читаясь как наложение. */}
      <div className="text-right text-[12px] text-muted">{result}</div>
    </div>
  );
}

export default FilterChips;
