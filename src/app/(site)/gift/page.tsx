import type { Metadata } from "next";
import { CorpForm } from "@/components/gift/CorpForm";
import { Disclosure } from "@/components/gift/Disclosure";
import { GiftCallback } from "@/components/gift/GiftCallback";
import { GiftConstructor } from "@/components/gift/GiftConstructor";
import { GiftFaq } from "@/components/gift/GiftFaq";
import { GiftTerms } from "@/components/gift/GiftTerms";
import { ImageSlot } from "@/components/ImageSlot";
import { formatPrice } from "@/lib/content/catalog";
import { gift } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Подарочный сертификат",
  description: gift.lead,
};

export default function GiftPage() {
  return (
    <>
      {/* ── Первый экран ──────────────────────────────────────────────── */}
      <div className="pad-x pad-y grid-auto items-center gap-[40px] border-b border-line bg-warm">
        <div>
          <div className="eyebrow mb-[12px] text-muted">{gift.eyebrow}</div>
          <h1 className="h1-hero max-w-[640px]">{gift.title}</h1>
          <p className="mt-[18px] max-w-[480px] text-[15px] leading-[1.65] text-muted">
            {gift.lead}
          </p>
          {/* Якорь, а не кнопка с обработчиком: плавный скролл делает CSS
              (scroll-behavior: smooth в globals.css), и ссылка работает без JS. */}
          <a href="#gift-order" className="btn-primary mt-[28px] min-h-[52px] px-[32px] py-[18px]">
            {gift.heroCta}
          </a>
          <div className="mt-[12px] text-[12px] text-muted">{gift.heroNote}</div>
        </div>
        <div className="aspect-4/3 bg-warm2">
          <ImageSlot photo={gift.heroPhoto} tone="warm" />
        </div>
      </div>

      {/* ── Заказ: короткий путь и конструктор ────────────────────────────
          Заявка выше конструктора намеренно: оплаты на сайте пока нет (§9),
          и девять полей, которые заканчиваются ничем, хуже двух, которые
          заканчиваются звонком. Конструктор из §8 остался целиком — ниже,
          под раскрытием. Появится эквайринг — меняем порядок обратно. */}
      <div id="gift-order" className="pad-x pad-y scroll-mt-[76px] border-b border-line">
        <GiftCallback />

        <div className="mt-[40px]">
          <Disclosure label={gift.builderToggle.open} hint={gift.builderToggle.hint}>
            <GiftConstructor />
          </Disclosure>
        </div>
      </div>

      {/* ── Три шага ──────────────────────────────────────────────────── */}
      <div className="pad-x pad-y border-b border-line bg-cool">
        <div className="h2-sec">{gift.stepsTitle}</div>
        <div className="grid-auto mt-[32px] gap-[32px] [--col-min:240px]">
          {gift.steps.map((s) => (
            <div key={s.num} className="border-t border-ink pt-[16px]">
              <div className="font-display text-[14px] tracking-[.2em] text-muted">{s.num}</div>
              <div className="mt-[8px] font-display text-[26px] leading-[1.15]">{s.title}</div>
              <p className="mt-[10px] text-[14px] leading-[1.65] text-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── На что хватит сертификата ─────────────────────────────────── */}
      <div className="pad-x pad-y border-b border-line">
        <div className="h2-sec">{gift.picksTitle}</div>
        <p className="mt-[14px] max-w-[520px] text-[15px] leading-[1.65] text-muted">
          {gift.picksLead}
        </p>
        <div className="grid-fill mt-[32px] gap-[28px_20px] [--col-min:200px]">
          {gift.picks.slice(0, gift.picksShown).map((p) => (
            <div key={p.id}>
              <div className="aspect-square bg-cool">
                <ImageSlot photo={`Фото: ${p.name}`} />
              </div>
              <div className="mt-[12px] text-[11px] uppercase tracking-[.14em] text-muted">
                {p.brand}
              </div>
              <div className="mt-[4px] font-display text-[20px] leading-[1.15]">{p.name}</div>
              <div className="mt-[6px] text-[13px]">
                {"price" in p && typeof p.price === "number"
                  ? formatPrice(p.price)
                  : ("priceText" in p ? p.priceText : "")}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-[24px] text-[12px] text-muted">{gift.picksNote}</p>
      </div>

      {/* ── Доставка ──────────────────────────────────────────────────── */}
      <div className="pad-x pad-y grid-auto items-center gap-[40px] border-b border-line bg-warm [--col-min:300px]">
        <div>
          <div className="h2-sec">{gift.delivery.title}</div>
          <p className="mt-[16px] max-w-[520px] text-[15px] leading-[1.7] text-muted">
            {gift.delivery.text}
          </p>
          <p className="mt-[18px] border-l border-line2 pl-[12px] text-[13px] text-ink">
            {gift.delivery.quote}
          </p>
        </div>
        <div className="aspect-4/3 bg-warm2">
          <ImageSlot photo={gift.delivery.photo} tone="warm" />
        </div>
      </div>

      {/* ── Корпоративная заявка ──────────────────────────────────────── */}
      <div className="pad-x pad-y grid-auto items-start gap-[40px] border-b border-line [--col-min:300px]">
        <div>
          <div className="h2-sec">{gift.corp.title}</div>
          <p className="mt-[16px] max-w-[480px] text-[15px] leading-[1.7] text-muted">
            {gift.corp.text}
          </p>
        </div>
        <div className="pad-x bg-cool py-[20px] desktop:py-[56px]">
          <Disclosure label={gift.corp.labels.submit}>
            <div className="pt-[8px]">
              <CorpForm />
            </div>
          </Disclosure>
        </div>
      </div>

      <GiftFaq />
      <GiftTerms />
    </>
  );
}
