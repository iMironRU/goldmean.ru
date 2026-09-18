"use client";

import { useState } from "react";
import { Field, inputClass } from "@/components/gift/fields";
import { gift, site } from "@/lib/content/site";

// Короткий путь: имя и телефон вместо конструктора на девять полей.
//
// Поставлен выше конструктора намеренно. Оплаты на сайте пока нет —
// эквайринг идёт этапом интеграции (§9), — и длинная форма, которая
// заканчивается ничем, хуже короткой, которая заканчивается звонком.
// Конструктор из §8 никуда не делся, он ниже под раскрытием.
export function GiftCallback() {
  const c = gift.callback;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState<string | null>(null);

  const ready = name.trim().length > 1 && phone.replace(/\D/g, "").length >= 10;

  if (sent) {
    return (
      <div className="fade-up">
        {/* ── ДЕМО-ПОЛОСКА ─────────────────────────────────────────────────
            Заявка никуда не уходит: канал приёма не выбран (§12 п.7). Без
            этой строки экран утверждал бы, что салон её получил. Удаляется
            одним блоком, когда канал подключат. */}
        <div className="mb-[24px] max-w-[520px] rounded-[3px] border border-accent px-[16px] py-[12px] text-[13px] leading-[1.6] text-accent">
          {c.demoNotice}
        </div>

        <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-accent text-[18px] text-accent">
          ✓
        </div>
        <div className="h2-sec mt-[20px]">{c.sentTitle}</div>
        <p className="mt-[12px] max-w-[480px] text-[15px] leading-[1.65] text-muted">
          {c.sentText.replace("{phone}", sent)}
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(null);
            setName("");
            setPhone("");
          }}
          className="link-action mt-[24px]"
        >
          {c.again}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="eyebrow mb-[12px] text-muted">{c.eyebrow}</div>
      <div className="h2-sec">{c.title}</div>
      <p className="mt-[16px] max-w-[520px] text-[15px] leading-[1.65] text-muted">{c.text}</p>

      <div className="mt-[24px] grid max-w-[520px] gap-[16px] desktop:grid-cols-2">
        <Field label={c.nameLabel}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={c.namePlaceholder}
            autoComplete="name"
            className={inputClass}
          />
        </Field>
        <Field label={c.phoneLabel}>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={c.phonePlaceholder}
            inputMode="tel"
            autoComplete="tel"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mt-[24px] flex w-full flex-col items-stretch gap-[12px] desktop:w-auto desktop:flex-row desktop:items-center">
        <button
          type="button"
          disabled={!ready}
          onClick={() => setSent(phone)}
          data-page-cta
          className="btn-primary disabled:cursor-not-allowed"
          style={ready ? undefined : { background: "var(--line2)", color: "var(--muted)" }}
        >
          {c.submit}
        </button>
        <a
          href={site.phoneHref}
          className="inline-flex min-h-[48px] items-center justify-center rounded-[3px] border border-line2 px-[20px] text-[14px] text-ink transition-colors hover:border-ink"
        >
          {site.phone}
        </a>
      </div>

      <p className="mt-[12px] text-[12px] leading-[1.5] text-muted">{c.note}</p>
    </div>
  );
}

export default GiftCallback;
