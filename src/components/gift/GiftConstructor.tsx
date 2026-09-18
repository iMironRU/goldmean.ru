"use client";

import { useMemo, useState } from "react";
import { ImageSlot } from "@/components/ImageSlot";
import { Checkbox, Chip, Field, inputClass } from "@/components/gift/fields";
import { formatPrice } from "@/lib/content/catalog";
import { gift, site } from "@/lib/content/site";

// Конструктор сертификата (§8 хендоффа): один экран, без шагов-визарда.
//
// Кнопка оплаты активна только когда собрано всё сразу — сумма не меньше
// минимальной, адрес, дата, интервал, имя, телефон и согласие. Это записано
// в §8 и проверяется здесь одним выражением: canOrder.

type State = {
  amount: number;
  custom: string;
  customOn: boolean;
  design: string;
  greeting: string;
  recipient: string;
  deliverTo: string;
  rphone: string;
  surprise: boolean;
  address: string;
  flat: string;
  date: string;
  slot: string;
  name: string;
  phone: string;
  comment: string;
  agree: boolean;
};

const INITIAL: State = {
  amount: gift.amountDefault,
  custom: "",
  customOn: false,
  design: gift.designDefault,
  greeting: "",
  recipient: "",
  deliverTo: "me",
  rphone: "",
  surprise: true,
  address: "",
  flat: "",
  date: "",
  slot: "",
  name: "",
  phone: "",
  comment: "",
  agree: false,
};

function orderNumber(): string {
  // В §8 номер генерирует сервер. Сервера у статического сайта нет, поэтому
  // до подключения эквайринга номер собирается на клиенте — только ради
  // демонстрации экрана успеха.
  return `ЗС-${1000 + Math.floor(Math.random() * 9000)}`;
}

export function GiftConstructor() {
  const [s, setS] = useState<State>(INITIAL);
  const [sent, setSent] = useState<string | null>(null);

  const set = <K extends keyof State>(k: K, v: State[K]) =>
    setS((prev) => ({ ...prev, [k]: v }));

  const sum = s.customOn ? parseInt(s.custom.replace(/\D/g, ""), 10) || 0 : s.amount;

  const canOrder =
    sum >= gift.amountMin &&
    !!s.address &&
    !!s.date &&
    !!s.slot &&
    !!s.name &&
    !!s.phone &&
    s.agree;

  const designLabel = useMemo(
    () => gift.designs.find((d) => d.key === s.design)?.label ?? "",
    [s.design],
  );

  const deliveryLine = useMemo(() => {
    const who = s.deliverTo === "recipient" ? "Получателю" : "Вам";
    const date = s.date ? s.date.split("-").reverse().join(".") : "";
    return [who, date, s.slot].filter(Boolean).join(", ");
  }, [s.deliverTo, s.date, s.slot]);

  const L = gift.labels;

  if (sent) {
    return (
      <div className="fade-up pad-x pad-y border-b border-line">
        {/* ── ДЕМО-ПОЛОСКА ─────────────────────────────────────────────────
            Оплаты нет: сайт статический, эквайринг подключается на этапе
            интеграции (§9), канал приёма заявок ещё не выбран (§12 п.7).
            Экран успеха оставлен слово в слово по макету, но без этой полоски
            он утверждал бы, что деньги списаны. Удаляется одним блоком, когда
            оплата заработает. */}
        <div className="mb-[28px] max-w-[640px] rounded-[3px] border border-accent px-[16px] py-[12px] text-[13px] leading-[1.6] text-accent">
          {gift.demoNotice}
        </div>

        <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-accent text-[18px] text-accent">
          ✓
        </div>
        <div className="h2-sec mt-[20px]">{gift.success.title}</div>
        <p className="mt-[12px] max-w-[520px] text-[15px] leading-[1.65] text-muted">
          {gift.success.text}
        </p>

        <dl className="mt-[28px] grid max-w-[520px] grid-cols-[auto_1fr] gap-[10px_24px] text-[15px]">
          <dt className="text-muted">{gift.success.rows.no}</dt>
          <dd className="m-0 font-mono">{sent}</dd>
          <dt className="text-muted">{gift.success.rows.sum}</dt>
          <dd className="m-0">{formatPrice(sum)}</dd>
          <dt className="text-muted">{gift.success.rows.design}</dt>
          <dd className="m-0">{designLabel}</dd>
          <dt className="text-muted">{gift.success.rows.delivery}</dt>
          <dd className="m-0">{deliveryLine}</dd>
        </dl>

        <div className="mt-[28px] flex flex-wrap items-center gap-[16px]">
          <button
            type="button"
            onClick={() => {
              setSent(null);
              setS(INITIAL);
            }}
            className="link-action"
          >
            {gift.success.again}
          </button>
          <a href={site.phoneHref} className="text-[11px] uppercase tracking-[.1em] text-muted">
            {site.phone}
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Заголовок и рамку секции рисует раскрытие, внутри которого стоит
          конструктор, — второй заголовок был бы лишним. */}
      <div id="gift-form" className="scroll-mt-[76px] pt-[8px]">
        <div className="grid-auto items-start gap-[40px] [--col-min:300px]">
          {/* ── Левая колонка: что дарим ─────────────────────────────── */}
          <div className="flex flex-col gap-[32px]">
            <div>
              <div className="mb-[12px] text-[12px] uppercase tracking-[.06em] text-muted">
                {L.amount}
              </div>
              {/* Сетка, а не перенос: при переносе каждый чип обжимался по
                  своему тексту, и ряды получались рваными. Равные ячейки
                  выстраивают их в колонки. */}
              <div className="grid grid-cols-2 gap-[6px] desktop:grid-cols-3">
                {gift.amounts.map((a) => (
                  <Chip
                    key={a}
                    active={!s.customOn && s.amount === a}
                    onClick={() => setS((p) => ({ ...p, customOn: false, amount: a }))}
                  >
                    {formatPrice(a)}
                  </Chip>
                ))}
                <Chip active={s.customOn} onClick={() => set("customOn", true)}>
                  {gift.customLabel}
                </Chip>
              </div>

              {s.customOn && (
                <input
                  value={s.custom}
                  onChange={(e) => set("custom", e.target.value)}
                  placeholder="Сумма, ₽"
                  inputMode="numeric"
                  aria-label="Своя сумма сертификата"
                  className={`${inputClass} mt-[16px] w-[180px] text-[18px]`}
                />
              )}

              <p className="mt-[12px] max-w-[380px] text-[12px] leading-[1.5] text-muted">
                {gift.amountNote}
              </p>
            </div>

            <div>
              <div className="mb-[12px] text-[12px] uppercase tracking-[.06em] text-muted">
                {L.design}
              </div>
              <div className="grid-fill gap-[10px] [--col-min:128px]">
                {gift.designs.map((d) => {
                  const active = d.key === s.design;
                  return (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => set("design", d.key)}
                      aria-pressed={active}
                      className="block cursor-pointer bg-transparent p-0 text-left"
                    >
                      <div
                        className="relative aspect-[16/10] bg-cool"
                        style={{
                          outline: `${active ? "2px" : "1px"} solid ${active ? "var(--ink)" : "var(--line2)"}`,
                          outlineOffset: "-1px",
                        }}
                      >
                        <ImageSlot photo={`Бланк: ${d.label} — ${d.accent}`} />
                        {active && (
                          <span className="absolute right-[6px] top-[6px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-ink text-[11px] text-bg">
                            ✓
                          </span>
                        )}
                      </div>
                      <div
                        className="mt-[8px] text-[13px]"
                        style={{ color: active ? "var(--ink)" : "var(--muted)" }}
                      >
                        {d.label}
                      </div>
                      <div className="mt-[2px] text-[11px] text-muted">{d.occasion}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-[18px]">
              <Field label={L.greeting}>
                <textarea
                  value={s.greeting}
                  onChange={(e) => set("greeting", e.target.value.slice(0, gift.greetingMax))}
                  rows={3}
                  placeholder={L.greetingPlaceholder}
                  className="resize-y border border-line2 bg-transparent p-[12px] text-[15px] normal-case leading-[1.5] tracking-normal text-ink outline-none"
                />
                <span className="self-end font-mono text-[11px] normal-case tracking-normal text-muted">
                  {s.greeting.length} / {gift.greetingMax}
                </span>
              </Field>

              <Field label={L.recipient}>
                <input
                  value={s.recipient}
                  onChange={(e) => set("recipient", e.target.value)}
                  placeholder={L.recipientPlaceholder}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          {/* ── Правая колонка: доставка и оплата ─────────────────────── */}
          <div className="pad-x flex flex-col gap-[22px] bg-warm py-[20px] desktop:py-[56px]">
            <div>
              <div className="mb-[10px] text-[12px] uppercase tracking-[.06em] text-muted">
                {L.deliverTo}
              </div>
              <div className="grid grid-cols-2 gap-[6px]">
                {gift.deliverTo.map((c) => (
                  <Chip
                    key={c.key}
                    active={s.deliverTo === c.key}
                    onClick={() => set("deliverTo", c.key)}
                  >
                    {c.label}
                  </Chip>
                ))}
              </div>
            </div>

            {s.deliverTo === "recipient" && (
              <div className="fade-up flex flex-col gap-[16px]">
                <Field label={L.rphone}>
                  <input
                    value={s.rphone}
                    onChange={(e) => set("rphone", e.target.value)}
                    placeholder={L.rphonePlaceholder}
                    inputMode="tel"
                    className={inputClass}
                  />
                </Field>
                <Checkbox checked={s.surprise} onChange={(v) => set("surprise", v)}>
                  {L.surprise}
                  <br />
                  <span className="text-[12px] text-muted">{L.surpriseNote}</span>
                </Checkbox>
              </div>
            )}

            <div className="grid grid-cols-[1fr_84px] gap-[12px]">
              <Field label={L.address}>
                <input
                  value={s.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder={L.addressPlaceholder}
                  className={inputClass}
                />
              </Field>
              <Field label={L.flat}>
                <input
                  value={s.flat}
                  onChange={(e) => set("flat", e.target.value)}
                  placeholder="—"
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="flex flex-col gap-[10px]">
              <span className="text-[12px] uppercase tracking-[.06em] text-muted">
                {L.datetime}
              </span>
              <input
                type="date"
                value={s.date}
                onChange={(e) => set("date", e.target.value)}
                aria-label={L.datetime}
                className={inputClass}
              />
              <div className="grid grid-cols-2 gap-[6px] desktop:grid-cols-3">
                {gift.slots.map((t) => (
                  <Chip key={t} mono active={s.slot === t} onClick={() => set("slot", t)}>
                    {t}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="grid-auto gap-[12px] [--col-min:130px]">
              <Field label={L.name}>
                <input
                  value={s.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder={L.namePlaceholder}
                  className={inputClass}
                />
              </Field>
              <Field label={L.phone}>
                <input
                  value={s.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder={L.phonePlaceholder}
                  inputMode="tel"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label={L.comment}>
              <input
                value={s.comment}
                onChange={(e) => set("comment", e.target.value)}
                placeholder={L.commentPlaceholder}
                className={inputClass}
              />
            </Field>

            <Checkbox checked={s.agree} onChange={(v) => set("agree", v)}>
              <span className="text-[12px] text-muted">{L.agree}</span>
            </Checkbox>

            <div className="flex flex-wrap items-center justify-between gap-[16px] border-t border-line pt-[20px]">
              <div>
                <div className="text-[11px] uppercase tracking-[.1em] text-muted">{L.total}</div>
                <div className="fact-num">{formatPrice(sum)}</div>
              </div>
              <button
                type="button"
                disabled={!canOrder}
                onClick={() => setSent(orderNumber())}
                className="btn-primary disabled:cursor-not-allowed"
                style={
                  canOrder
                    ? undefined
                    : { background: "var(--line2)", color: "var(--muted)", opacity: 1 }
                }
              >
                {L.submit}
              </button>
            </div>

            {!canOrder && <div className="text-[12px] text-muted">{L.incomplete}</div>}
          </div>
        </div>
      </div>

      {/* Мобильная панель оплаты: номинал слева, действие справа. Пока форма
          не собрана, кнопка прокручивает к ней, а не притворяется активной.

          fixed, а не sticky. Панель стоит в потоке сразу после формы, и
          sticky держал её у низа экрана лишь пока человек ВЫШЕ формы: стоило
          пройти её — и панель всплывала наверх, накрывая шапку сайта.
          Глобальный sticky-CTA на /gift скрыт (§6), так что конфликта нет.
          Рисуется только при раскрытом конструкторе — он монтируется по
          требованию. */}
      <div
        className="fixed inset-x-0 bottom-0 z-[6] flex items-center gap-[12px] px-[16px] pt-[10px] pb-[14px] desktop:hidden"
        style={{ background: "linear-gradient(to top, var(--bg) 70%, transparent)" }}
      >
        <div className="flex-none">
          <div className="text-[10px] uppercase tracking-[.1em] text-muted">{L.amount}</div>
          <div className="font-display text-[22px] leading-[1.1]">{formatPrice(sum)}</div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (canOrder) setSent(orderNumber());
            else document.getElementById("gift-form")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="btn-primary flex-1"
          style={
            canOrder
              ? { boxShadow: "0 12px 30px -12px rgba(28,27,25,.5)" }
              : { background: "var(--line2)", color: "var(--muted)" }
          }
        >
          {canOrder ? L.submit : L.stickyFill}
        </button>
      </div>
    </>
  );
}

export default GiftConstructor;
