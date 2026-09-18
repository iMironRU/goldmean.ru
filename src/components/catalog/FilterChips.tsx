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
// Телефон: ровно по строке на группу, чипы внутри прокручиваются вбок. Раньше
// они переносились, и панель разрасталась до четырёх рядов — 241 px, почти
// треть экрана.
//
// Десктоп: группы и счётчик стоят в одну строку, если помещаются. Если нет —
// следующая группа ЦЕЛИКОМ уходит на строку ниже (flex-wrap по группам, не по
// чипам), так что рваного ряда из отдельных чипов не бывает. У часов (7 чипов)
// строка одна уже с 1024 px, у украшений (11 чипов, «Рождение ребёнка» —
// 134 px) — почти всегда две. Промежуток между группами 20 px, а не шире:
// на 1024 у часов строке нужно 893 px из 897, при 24 счётчик уже переносился.
//
// Чипы одной группы — одинаковой ширины, по самому широкому: сетка
// grid-flow-col с auto-cols-fr внутри w-max уравнивает колонки. Внутри
// прокручиваемой ленты это тоже работает — лента просто длиннее.
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
    <div className="filters-sticky pad-x flex flex-col gap-[8px] border-b border-line py-[16px] desktop:flex-row desktop:flex-wrap desktop:items-center desktop:gap-x-[20px]">
      {groups.map((g) => {
        const current = params.get(g.param) ?? "all";

        return (
          <div key={g.param} className="flex items-center gap-[10px] desktop:flex-none">
            <span className="w-[76px] shrink-0 text-[11px] uppercase tracking-[.1em] text-muted desktop:w-auto">
              {g.label}
            </span>

            {/* min-w-0 обязателен: без него флекс-элемент не даёт себя сжать
                по содержимому, и вместо прокрутки строка распирает панель. */}
            <div className="chips-scroll min-w-0 flex-1 overflow-x-auto">
              <div className="grid w-max auto-cols-fr grid-flow-col gap-[6px]">
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
            </div>
          </div>
        );
      })}

      {/* Счётчик — итог обоих фильтров, поэтому отдельной строкой под ними.
          В строке с чипами он отбирал бы у ленты 70 px из 197 на телефоне, и
          обрезанный чип упирался бы в него вплотную, читаясь как наложение.
          На десктопе места хватает — там он в той же строке, прижат вправо. */}
      <div className="text-right text-[12px] text-muted desktop:ml-auto">{result}</div>
    </div>
  );
}

export default FilterChips;
