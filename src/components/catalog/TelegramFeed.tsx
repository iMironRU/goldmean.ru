import { ImageSlot } from "@/components/ImageSlot";
import { jewelry } from "@/lib/content/catalog";
import { postMeta, telegramPosts } from "@/lib/content/telegram";
import { site } from "@/lib/content/site";

// Лента Telegram внизу каталога украшений (§7 хендоффа).
//
// Посты настоящие: их забирает scripts/fetch-telegram.mjs, а GitHub Actions
// запускает его по расписанию. Вёрстка своя, а не виджет Telegram: виджет
// принёс бы на страницу чужие шрифты и цвета и внешний скрипт на каждой
// загрузке.
//
// Живая лента сделана именно на Telegram, а не на Instagram: Meta признана
// экстремистской и запрещена в РФ (§12 п.4), и у посетителя без VPN на месте
// ленты была бы пустота.
export function TelegramFeed() {
  const t = jewelry.telegram;

  return (
    <div id="vitrina" className="pad-x pad-y scroll-mt-[76px] border-t border-line bg-warm">
      <div className="mb-[24px] flex flex-wrap items-end justify-between gap-[16px]">
        <div>
          <div className="eyebrow mb-[10px] text-muted">{t.eyebrow}</div>
          <div className="h2-sec">{t.title}</div>
        </div>
        <a href={site.social.telegram} target="_blank" rel="noreferrer" className="link-action">
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

        {/* auto-FIT, а не fill: постов ровно три, и auto-fill рисовал бы
            пустую серую колонку справа. */}
        <div className="grid-auto gap-px bg-line [--col-min:220px]">
          {telegramPosts.map((p) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="block bg-bg p-[14px] text-ink"
            >
              <div className="aspect-square bg-warm2">
                {/* Картинка есть не у каждого поста: бывают текстовые и
                    видео. Тогда остаётся плейсхолдер, а не дыра. */}
                <ImageSlot
                  photo="Пост без фотографии"
                  src={p.image ?? undefined}
                  tone="warm"
                />
              </div>
              <div className="mt-[12px] line-clamp-4 text-[13px] leading-[1.55] whitespace-pre-line">
                {p.text}
              </div>
              <div className="mt-[8px] text-[11px] text-muted">{postMeta(p)}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TelegramFeed;
