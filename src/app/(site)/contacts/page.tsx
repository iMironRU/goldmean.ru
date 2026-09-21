import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingForm } from "@/components/contacts/BookingForm";
import { ImageSlot } from "@/components/ImageSlot";
import { contacts, site } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Контакты в Оренбурге",
  description:
    "Оренбург, ул. Советская, 31. Вт–Сб 10:30–19:00, +7 (3532) 77-63-30. Запись на консультацию. Часовой магазин в ТЦ «Север».",
};

// «Контакты» (§4 хендоффа): адрес, режим, телефон, карта и форма записи.
// Адресов два — салон и часовой магазин в ТЦ «Север»; оба берутся из
// site.stores, как в подвале и на «О магазине». Пустые адрес и часы у
// магазина в ТЦ «Север» не рисуются, пока заказчик их не дал.
export default function ContactsPage() {
  const l = contacts.labels;
  const main = site.stores[0];

  return (
    <div className="pad-x pad-y grid-auto items-start gap-[40px] [--col-min:320px]">
      <div>
        <div className="eyebrow mb-[12px] text-muted">{contacts.eyebrow}</div>
        <h1 className="h1-hero">{contacts.title}</h1>

        <div className="mt-[32px] flex flex-col gap-[28px]">
          {site.stores.map((s) => (
            <div key={s.name} className="border-t border-line pt-[16px]">
              <div className="text-[11px] uppercase tracking-[.14em] text-muted">{s.kind}</div>
              <div className="mt-[4px] font-display text-[26px] leading-[1.15]">{s.name}</div>
              <p className="mt-[4px] text-[13px] text-muted">{s.what}</p>
              {(s.address || s.hours) && (
                <dl className="mt-[14px] grid grid-cols-[auto_1fr] gap-x-[24px] gap-y-[8px] text-[15px] leading-[1.5]">
                  {s.address && (
                    <>
                      <dt className="text-muted">{l.address}</dt>
                      <dd>{s.address}</dd>
                    </>
                  )}
                  {s.hours && (
                    <>
                      <dt className="text-muted">{l.hours}</dt>
                      <dd>
                        {s.hours}
                        {s.daysOff && (
                          <>
                            <br />
                            <span className="text-[13px] text-muted">{s.daysOff}</span>
                          </>
                        )}
                      </dd>
                    </>
                  )}
                </dl>
              )}
            </div>
          ))}

          <dl className="grid grid-cols-[auto_1fr] gap-x-[24px] gap-y-[8px] border-t border-line pt-[16px] text-[15px] leading-[1.5]">
            <dt className="text-muted">{l.phone}</dt>
            <dd>
              <a href={site.phoneHref} className="text-ink">
                {site.phone}
              </a>
            </dd>
            <dt className="text-muted">{l.social}</dt>
            <dd>
              <a href={site.social.telegram} target="_blank" rel="noreferrer" className="text-accent">
                Telegram
              </a>{" "}
              ·{" "}
              <a href={site.social.instagram} target="_blank" rel="noreferrer" className="text-accent">
                Instagram
              </a>
            </dd>
          </dl>
        </div>

        <div className="relative mt-[32px] aspect-4/3 bg-cool2">
          <ImageSlot photo={contacts.mapPhoto} />
          {main.map && (
            <a
              href={main.map}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-[12px] left-[12px] border border-line2 bg-bg px-[12px] py-[8px] text-[12px] text-ink"
            >
              {contacts.mapLink}
            </a>
          )}
        </div>
      </div>

      {/* Suspense обязателен: форма читает ?note= и ?interest= через
          useSearchParams, а при статическом экспорте это клиентская часть. */}
      <div className="pad-x bg-warm py-[28px] desktop:py-[40px]">
        <Suspense fallback={null}>
          <BookingForm />
        </Suspense>
      </div>
    </div>
  );
}
