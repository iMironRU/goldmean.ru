"use client";

import { useState } from "react";
import { gift } from "@/lib/content/site";

// Свёрнутый блок правил. Формулировки юридически значимы и меняются только
// с заказчиком (§8 хендоффа) — поэтому текст живёт в content/gift.json.
export function GiftTerms() {
  const [open, setOpen] = useState(false);

  return (
    <div className="pad-x pad-y">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-baseline gap-[12px] border-0 bg-transparent p-0 text-ink"
      >
        <span className="eyebrow text-muted">{gift.termsTitle}</span>
        <span aria-hidden className="text-[16px] text-muted">
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div className="mt-[20px] flex max-w-[640px] flex-col gap-[12px]">
          <p className="text-[12px] leading-[1.6] text-muted">{gift.termsNote}</p>
          {gift.terms.map((t) => (
            <p key={t} className="border-t border-line pt-[12px] text-[14px] leading-[1.65] text-ink">
              {t}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default GiftTerms;
