"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Chip, Field, inputClass } from "@/components/gift/fields";
import { contacts, site } from "@/lib/content/site";

// Форма записи (§4 хендоффа): имя, телефон, «что интересует», «удобное
// время», комментарий. Карточки товара передают модель в ?note= (§7) и раздел
// в ?interest= — форма подхватывает оба, чтобы человеку не пришлось
// объяснять по телефону, о чём речь.
//
// Отправки нет, как и на сертификате: канал приёма заявок не выбран (§12
// п.7). Поэтому на экране успеха — ДЕМО-ПОЛОСКА.
export function BookingForm() {
  const f = contacts.form;
  const params = useSearchParams();
  const note = params.get("note") ?? "";
  const fromLink = params.get("interest");
  const initialInterest = f.interests.some((i) => i.key === fromLink)
    ? (fromLink as string)
    : f.interestDefault;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState(initialInterest);
  const [time, setTime] = useState(f.timeDefault);
  const [store, setStore] = useState(site.stores[0].name);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  const ready = name.trim().length > 1 && phone.replace(/\D/g, "").length >= 10;
  const interestLabel = f.interests.find((i) => i.key === interest)?.label ?? "";
  const timeLabel = f.times.find((t) => t.key === time)?.label ?? "";

  // В магазине «только часы» украшений нет: при интересе «Украшения» он
  // недоступен, а если был выбран — заявка уходит в салон. Иначе салон
  // получил бы «украшения в ТЦ «Север»», где их не бывает. Сервис не
  // ограничиваем: где мастерская принимает часы, решает салон по звонку.
  const storeBlocked = (s: (typeof site.stores)[number]) => interest === "jewelry" && s.watchesOnly;
  const current = site.stores.find((s) => s.name === store);
  const effectiveStore = current && !storeBlocked(current) ? store : site.stores[0].name;
  const showWatchesOnlyNote = site.stores.some(storeBlocked);

  if (sent) {
    return (
      <div className="fade-up">
        {/* ── ДЕМО-ПОЛОСКА ─────────────────────────────────────────────────
            Заявка никуда не уходит: канал приёма не выбран (§12 п.7). Без
            этой строки экран утверждал бы, что салон её получил. Удаляется
            одним блоком, когда канал подключат. */}
        <div className="mb-[24px] rounded-[3px] border border-accent px-[16px] py-[12px] text-[13px] leading-[1.6] text-accent">
          {f.demoNotice}
        </div>

        <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-accent text-[18px] text-accent">
          ✓
        </div>
        <div className="h2-sec mt-[20px]">{f.sentTitle}</div>
        <p className="mt-[12px] text-[14px] leading-[1.65] text-muted">
          {f.sentText
            .replace("{name}", name.trim() ? `${name.trim()}, ` : "")
            .replace("{phone}", phone)}
        </p>
        <div className="mt-[24px] border-t border-line pt-[18px] text-[13px] leading-[1.8] text-muted">
          {f.sentInterest}:{" "}
          <span className="text-ink">
            {interestLabel}
            {note && ` — ${note}`}
          </span>
          <br />
          {f.sentTime}: <span className="text-ink">{timeLabel}</span>
          <br />
          {f.sentStore}: <span className="text-ink">{effectiveStore}</span>
        </div>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setName("");
            setPhone("");
            setComment("");
          }}
          className="link-action mt-[24px]"
        >
          {f.again}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="h2-sec">{site.cta.label}</div>
      <p className="mt-[8px] text-[13px] leading-[1.6] text-muted">{f.text}</p>

      <div className="mt-[28px] flex flex-col gap-[20px]">
        <Field label={f.nameLabel}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={f.namePlaceholder}
            autoComplete="name"
            className={inputClass}
          />
        </Field>
        <Field label={f.phoneLabel}>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={f.phonePlaceholder}
            inputMode="tel"
            autoComplete="tel"
            className={inputClass}
          />
        </Field>

        {/* Чипы группы — в сетке с равными ячейками, а не во flex-wrap: так
            они выстраиваются в колонки (см. AGENTS.md → «Группы кнопок»). */}
        <div className="flex flex-col gap-[8px]">
          <span className="text-[12px] uppercase tracking-[.06em] text-muted">{f.interestLabel}</span>
          <div className="grid grid-cols-3 gap-[6px]">
            {f.interests.map((i) => (
              <Chip key={i.key} active={interest === i.key} onClick={() => setInterest(i.key)}>
                {i.label}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[8px]">
          <span className="text-[12px] uppercase tracking-[.06em] text-muted">{f.timeLabel}</span>
          <div className="grid gap-[6px] tablet:grid-cols-3">
            {f.times.map((t) => (
              <Chip key={t.key} active={time === t.key} onClick={() => setTime(t.key)}>
                {t.label}
              </Chip>
            ))}
          </div>
        </div>

        {/* Два магазина — салон и часовой в ТЦ «Север». В хендоффе поля нет,
            добавлено по решению заказчика вместе со вторым адресом. */}
        <div className="flex flex-col gap-[8px]">
          <span className="text-[12px] uppercase tracking-[.06em] text-muted">{f.storeLabel}</span>
          <div className="grid grid-cols-2 gap-[6px]">
            {site.stores.map((s) => (
              <Chip
                key={s.name}
                active={effectiveStore === s.name}
                disabled={storeBlocked(s)}
                onClick={() => setStore(s.name)}
              >
                {s.name}
              </Chip>
            ))}
          </div>
          {showWatchesOnlyNote && (
            <p className="text-[12px] leading-[1.5] text-muted">{f.storeWatchesOnly}</p>
          )}
        </div>

        {note && (
          <div className="border-l border-line2 pl-[12px] text-[13px] text-muted">
            {f.notePrefix} {note}
          </div>
        )}

        <Field label={f.commentLabel}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={f.commentPlaceholder}
            rows={2}
            className={`${inputClass} resize-none`}
          />
        </Field>

        <button
          type="button"
          disabled={!ready}
          onClick={() => setSent(true)}
          data-page-cta
          className="btn-primary mt-[6px] disabled:cursor-not-allowed"
          style={ready ? undefined : { background: "var(--line2)", color: "var(--muted)" }}
        >
          {f.submit}
        </button>
        <p className="text-[11px] leading-[1.5] text-muted">{f.consent}</p>
      </div>
    </div>
  );
}

export default BookingForm;
