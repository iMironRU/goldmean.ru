"use client";

import { useState, type ReactNode } from "react";

// Раскрывающийся блок: заголовок-кнопка со знаком + / −, как у FAQ и правил
// сертификата (§8). Содержимое монтируется только при раскрытии — внутри
// конструктора живёт своя панель оплаты, и в закрытом виде ей делать нечего.
export function Disclosure({
  label,
  hint,
  children,
  id,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  id?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div id={id} className="scroll-mt-[76px]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-baseline justify-between gap-[16px] border-t border-ink bg-transparent py-[18px] text-left text-ink"
      >
        <span>
          <span className="h3-card block">{label}</span>
          {hint ? (
            <span className="mt-[4px] block text-[13px] leading-[1.5] text-muted">{hint}</span>
          ) : null}
        </span>
        <span aria-hidden className="flex-none text-[22px] leading-none text-muted">
          {open ? "−" : "+"}
        </span>
      </button>

      {/* Без fade-up по той же причине: внутри раскрытия может стоять
          фиксированная панель (конструктор сертификата), а анимация
          transform ломает ей привязку к окну. */}
      {open && <div className="pb-[8px]">{children}</div>}
    </div>
  );
}

export default Disclosure;
