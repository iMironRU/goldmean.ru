import type { Metadata } from "next";
import { TelegramFeed } from "@/components/catalog/TelegramFeed";
import { ImageSlot } from "@/components/ImageSlot";
import { watches } from "@/lib/content/catalog";
import { about } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "О магазине",
  description: about.history.lead,
};

// «О магазине» (§4 хендоффа): история, документы, отзывы, лента Telegram.
// Первый экран, отзывы и документы — по прототипу; история и блок адресов
// добавлены по фактам заказчика (26 лет, второй магазин в ТЦ «Север»).
export default function AboutPage() {
  // Число марок — из каталога, а не цифрой в тексте: в прототипе стояло 13,
  // после Swiss Alpine Military стало 14, и следующая марка поменяет его сама.
  const facts = [
    { num: about.years, label: about.yearsLabel },
    { num: String(watches.brands.length), label: about.brandsLabel },
    { num: about.rating, label: about.ratingLabel },
  ];

  return (
    <>
      {/* ── Первый экран ──────────────────────────────────────────────── */}
      <div className="pad-x pad-y grid-auto items-center gap-[40px] border-b border-line">
        <div>
          <div className="eyebrow mb-[12px] text-muted">{about.eyebrow}</div>
          <h1 className="h1-hero">{about.title}</h1>
          <p className="mt-[18px] max-w-[480px] text-[15px] leading-[1.65] text-muted">
            {about.lead}
          </p>
          <div className="mt-[28px] flex flex-wrap gap-x-[32px] gap-y-[20px]">
            {facts.map((f) => (
              <div key={f.label}>
                <div className="font-display text-[40px] leading-none">{f.num}</div>
                <div className="mt-[4px] text-[12px] text-muted">{f.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="aspect-4/3 bg-warm2">
          <ImageSlot photo={about.photo} tone="warm" />
        </div>
      </div>

      {/* ── История ───────────────────────────────────────────────────── */}
      <div className="pad-x pad-y grid-auto gap-[40px] border-b border-line bg-warm [--col-min:320px]">
        <div>
          <div className="eyebrow mb-[12px] text-muted">{about.history.eyebrow}</div>
          <h2 className="h2-sec max-w-[520px]">{about.history.title}</h2>
          <p className="mt-[18px] max-w-[520px] text-[15px] leading-[1.7] text-muted">
            {about.history.lead}
          </p>
        </div>
        <ol className="flex flex-col gap-[28px]">
          {about.history.chapters.map((c, i) => (
            <li key={c.title} className="border-t border-ink pt-[16px]">
              <div className="font-display text-[14px] tracking-[.2em] text-muted">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mt-[6px] font-display text-[26px] leading-[1.15]">{c.title}</div>
              <p className="mt-[8px] max-w-[520px] text-[14px] leading-[1.65] text-muted">{c.text}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* ── Адреса ────────────────────────────────────────────────────────
          Пустые адрес и часы не рисуются: у магазина в ТЦ «Север» их пока
          нет, и строка «—» читалась бы как «закрыто». */}
      <div className="pad-x pad-y border-b border-line">
        <div className="eyebrow mb-[10px] text-muted">{about.stores.eyebrow}</div>
        <h2 className="h2-sec">{about.stores.title}</h2>
        <div className="grid-auto mt-[32px] gap-[24px] [--col-min:300px]">
          {about.stores.items.map((s, i) => (
            <div key={s.name}>
              <div className={`aspect-3/2 ${i === 0 ? "bg-warm2" : "bg-cool2"}`}>
                <ImageSlot photo={s.photo} tone={i === 0 ? "warm" : "cool"} />
              </div>
              <div className="mt-[16px] text-[11px] uppercase tracking-[.14em] text-muted">{s.kind}</div>
              <div className="mt-[4px] font-display text-[28px] leading-[1.1]">{s.name}</div>
              <p className="mt-[8px] text-[14px] leading-[1.6]">{s.what}</p>
              {(s.address || s.hours) && (
                <p className="mt-[6px] text-[13px] leading-[1.6] text-muted">
                  {s.address}
                  {s.address && s.hours && <br />}
                  {s.hours}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Отзывы — цитаты с Яндекс Карт, тексты не меняются (§4) ───── */}
      <div className="pad-x pad-y border-b border-line">
        <div className="eyebrow mb-[24px] text-muted">{about.reviews.eyebrow}</div>
        <div className="grid-auto gap-[24px] [--col-min:280px]">
          {about.reviews.items.map((r) => (
            <figure key={r.text} className="border-t border-ink pt-[18px]">
              <blockquote className="font-display text-[22px] leading-[1.35] [text-wrap:pretty]">
                {r.text}
              </blockquote>
              <figcaption className="mt-[14px] text-[12px] text-muted">{r.who}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* ── Документы ─────────────────────────────────────────────────── */}
      <div className="pad-x pad-y bg-cool">
        <div className="mb-[28px] flex flex-wrap items-end justify-between gap-[16px]">
          <div>
            <div className="eyebrow mb-[10px] text-muted">{about.docs.eyebrow}</div>
            <h2 className="h2-sec">{about.docs.title}</h2>
          </div>
          <p className="max-w-[360px] text-[13px] leading-[1.6] text-muted">{about.docs.note}</p>
        </div>
        {/* По два в ряд на телефоне: столбиком во всю ширину четыре
            вертикальных листа занимали 2,6 экрана. */}
        <div className="grid grid-cols-2 gap-[12px] tablet:grid-cols-4 tablet:gap-[16px]">
          {about.docs.items.map((name) => (
            <div key={name}>
              <div className="aspect-3/4 border border-line2 bg-[#fdfcfa] shadow-[0_20px_40px_-30px_rgba(28,27,25,.4)]">
                <ImageSlot photo={name} fit="contain" />
              </div>
              <div className="mt-[10px] text-[13px]">{name}</div>
            </div>
          ))}
        </div>
      </div>

      <TelegramFeed />
    </>
  );
}
