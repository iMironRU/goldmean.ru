"use client";

import { useState } from "react";
import { gift } from "@/lib/content/site";

// FAQ-аккордеон: раскрыт максимум один вопрос, знак + / − (§8 хендоффа).
// Без анимации высоты — так в макете, раскрытие мгновенное (§10).
export function GiftFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="pad-x pad-y border-b border-line">
      <div className="h2-sec">{gift.faqTitle}</div>
      <div className="mt-[28px] max-w-[720px]">
        {gift.faq.map((q, i) => {
          const isOpen = open === i;
          return (
            <div key={q.q} className="border-t border-line">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-baseline justify-between gap-[16px] border-0 bg-transparent py-[18px] text-left text-ink"
              >
                <span className="text-[16px] leading-[1.4]">{q.q}</span>
                <span aria-hidden className="flex-none text-[18px] text-muted">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && (
                <div className="max-w-[560px] pb-[20px] text-[14px] leading-[1.7] text-muted">
                  {q.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GiftFaq;
