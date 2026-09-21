import type { Metadata } from "next";
import Link from "next/link";
import { CorpForm } from "@/components/gift/CorpForm";
import { Disclosure } from "@/components/gift/Disclosure";
import { GiftCallback } from "@/components/gift/GiftCallback";
import { GiftConstructor } from "@/components/gift/GiftConstructor";
import { GiftFaq } from "@/components/gift/GiftFaq";
import { GiftTerms } from "@/components/gift/GiftTerms";
import { ImageSlot } from "@/components/ImageSlot";
import { gift } from "@/lib/content/site";

export const metadata: Metadata = {
  title: gift.seoTitle,
  description: gift.seoDescription,
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
          <a href="#gift-order" data-page-cta className="btn-primary mt-[28px]">
            {gift.heroCta}
          </a>
          <div className="mt-[12px] text-[12px] text-muted">{gift.heroNote}</div>
        </div>
        <div className="aspect-4/3 bg-warm2">
          <ImageSlot photo={gift.heroPhoto} tone="warm" />
        </div>
      </div>

      {/* ── Три шага ────────────────────────────────────────────────────
          Выше заказа намеренно: блок отвечает на первый вопрос посетителя —
          что вообще происходит после оплаты и как получатель это тратит. Под
          формой он объяснял механику тому, кто уже её принял. Кто пришёл
          готовым, минует блок кнопкой первого экрана: она ведёт на #gift-order. */}
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

      {/* ── Витрина одной строкой ─────────────────────────────────────
          Здесь стоял блок «На что хватит сертификата» — восемь плиток на 2,5
          экрана телефона, которые ни на что не отвечали: привязать их к
          выбранному номиналу нельзя (самые дешёвые часы в каталоге — 42 000 ₽,
          цен на украшения заказчик ещё не дал), а без привязки это просто
          картинки после формы заказа. Порядок цен показывает каталог, где они
          настоящие и есть фильтры. Тексты блока не удалены — лежат в
          content/gift.json под ключом _picksКомментарий. */}
      <div className="pad-x border-b border-line py-[28px]">
        <div className="flex flex-col gap-[16px] desktop:flex-row desktop:items-center desktop:justify-between desktop:gap-[32px]">
          <p className="max-w-[560px] text-[15px] leading-[1.65] text-muted">
            {gift.showcase.text}
          </p>
          <div className="grid gap-[12px] desktop:auto-cols-max desktop:grid-flow-col desktop:gap-[24px]">
            {gift.showcase.links.map((l) => (
              <Link key={l.href} href={l.href} className="link-action justify-self-start">
                {l.label}
              </Link>
            ))}
          </div>
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
