"use client";

import Link from "next/link";
import { useState } from "react";
import { specHint } from "@/lib/content/spec-hints";

export type Spec = { k: string; v: string };

// Таблица характеристик в карточке товара (§7 хендоффа): две колонки,
// 140 px под название, строки разделены линиями.
//
// У характеристики, для которой есть пояснение, рядом с названием стоит «?».
// По клику расшифровка раскрывается прямо в строке — человек остаётся на
// товаре, а не уходит читать справочник. Ссылка «подробнее» ведёт в нужный
// раздел справочника, а не на его начало.
//
// Кнопка, а не наведение: на телефоне ховера нет, и подсказка была бы
// недоступна доброй половине посетителей.
export function SpecTable({ specs }: { specs: Spec[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <dl className="mt-[36px] border-t border-ink">
      {specs.map((s) => {
        const hint = specHint(s.k);
        const isOpen = open === s.k;

        return (
          <div key={s.k} className="border-b border-line">
            <div className="grid grid-cols-[110px_1fr] gap-[16px] py-[12px] text-[14px] desktop:grid-cols-[140px_1fr]">
              <dt className="flex items-start gap-[6px] text-muted">
                <span>{s.k}</span>
                {hint && (
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : s.k)}
                    aria-expanded={isOpen}
                    aria-label={`Что такое «${s.k}»`}
                    className="mt-[1px] flex h-[16px] w-[16px] flex-none items-center justify-center rounded-full border text-[10px] leading-none transition-colors"
                    style={{
                      borderColor: isOpen ? "var(--accent)" : "var(--line2)",
                      color: isOpen ? "var(--accent)" : "var(--muted)",
                    }}
                  >
                    ?
                  </button>
                )}
              </dt>
              <dd className="m-0">{s.v}</dd>
            </div>

            {hint && isOpen && (
              <div className="fade-up pb-[14px] text-[13px] leading-[1.6] text-muted desktop:pl-[156px]">
                {hint.text}{" "}
                <Link
                  href={hint.href}
                  className="whitespace-nowrap text-accent underline underline-offset-4"
                >
                  подробнее
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </dl>
  );
}

export default SpecTable;
