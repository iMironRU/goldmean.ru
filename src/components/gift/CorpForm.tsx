"use client";

import { useState } from "react";
import { Field, inputClass } from "@/components/gift/fields";
import { gift } from "@/lib/content/site";

// Корпоративная заявка: счёт, а не онлайн-оплата (§8 хендоффа).
export function CorpForm() {
  const [sent, setSent] = useState(false);
  const [f, setF] = useState({ org: "", inn: "", qty: "", contact: "" });
  const L = gift.corp.labels;

  if (sent) {
    return (
      <div className="fade-up">
        <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-accent text-[18px] text-accent">
          ✓
        </div>
        <div className="font-display text-[26px] mt-[18px]">{gift.corp.sentTitle}</div>
        <p className="mt-[10px] text-[14px] leading-[1.65] text-muted">{gift.corp.sentText}</p>
        <button type="button" onClick={() => setSent(false)} className="link-action mt-[20px]">
          {gift.corp.again}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[16px]">
      <Field label={L.org}>
        <input
          value={f.org}
          onChange={(e) => setF({ ...f, org: e.target.value })}
          placeholder={L.orgPlaceholder}
          className={inputClass}
        />
      </Field>

      <div className="grid-auto gap-[12px] [--col-min:120px]">
        <Field label={L.inn}>
          <input
            value={f.inn}
            onChange={(e) => setF({ ...f, inn: e.target.value })}
            placeholder={L.innPlaceholder}
            inputMode="numeric"
            className={inputClass}
          />
        </Field>
        <Field label={L.qty}>
          <input
            value={f.qty}
            onChange={(e) => setF({ ...f, qty: e.target.value })}
            placeholder={L.qtyPlaceholder}
            inputMode="numeric"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label={L.contact}>
        <input
          value={f.contact}
          onChange={(e) => setF({ ...f, contact: e.target.value })}
          placeholder={L.contactPlaceholder}
          className={inputClass}
        />
      </Field>

      <button
        type="button"
        onClick={() => setSent(true)}
        className="btn-primary mt-[6px]"
      >
        {L.submit}
      </button>

      <p className="text-[11px] leading-[1.5] text-muted">{gift.corp.note}</p>
    </div>
  );
}

export default CorpForm;
