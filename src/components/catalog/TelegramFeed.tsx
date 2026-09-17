import { ImageSlot } from "@/components/ImageSlot";
import { jewelry } from "@/lib/content/catalog";
import { site } from "@/lib/content/site";

// Лента Telegram внизу каталога украшений (§7 хендоффа).
//
// Это имитация ленты по данным из content/jewelry.json, а не встроенный
// виджет Telegram: в MVP канал подключается на этапе интеграции, а до тех пор
// заказчику надо видеть, как блок выглядит и сколько места занимает.
export function TelegramFeed() {
  const t = jewelry.telegram;

  return (
    // Якорь для кнопки в шапке производителя. scroll-mt — чтобы заголовок
    // блока не уезжал под липкую шапку сайта.
    <div id="vitrina" className="pad-x pad-y scroll-mt-[76px] border-t border-line bg-warm">
      <div className="mb-[24px] flex flex-wrap items-end justify-between gap-[16px]">
        <div>
          <div className="eyebrow mb-[10px] text-muted">{t.eyebrow}</div>
          <div className="h2-sec">{t.title}</div>
        </div>
        <a
          href={site.social.telegram}
          target="_blank"
          rel="noreferrer"
          className="link-action"
        >
          {t.action}
        </a>
      </div>

      <div className="border border-line bg-bg">
        <div className="flex items-center gap-[12px] border-b border-line px-[18px] py-[14px]">
          <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-ink font-display text-[18px] text-bg">
            З
          </div>
          <div>
            <div className="text-[14px] font-medium">{t.channelTitle}</div>
            <div className="text-[12px] text-muted">{t.channelHandle}</div>
          </div>
        </div>

        {/* auto-FIT, а не fill: постов три, и пустая четвёртая колонка
            показывала бы серый прямоугольник справа. */}
        <div className="grid-auto gap-px bg-line [--col-min:220px]">
          {t.posts.map((p) => (
            <div key={p.id} className="bg-bg p-[14px]">
              <div className="aspect-square bg-warm2">
                <ImageSlot photo="Фото из поста в Telegram" tone="warm" />
              </div>
              <div className="mt-[12px] text-[13px] leading-[1.55]">{p.text}</div>
              <div className="mt-[8px] text-[11px] text-muted">{p.meta}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TelegramFeed;
