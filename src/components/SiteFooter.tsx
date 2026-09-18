import Link from "next/link";
import { site } from "@/lib/content/site";

// Подвал (§6 хендоффа). Дисклеймер про Meta — обязателен перед релизом,
// §12 п.4; текст согласуется с заказчиком вместе с проверкой аккаунта.
export function SiteFooter() {
  return (
    // Строка с переносом, а не сетка равных колонок: ссылки в две колонки
    // занимают ~274 px, и в равной колонке сетки (206 px на 1024) они
    // вылезали за край и давали горизонтальную прокрутку страницы. Здесь
    // текстовые блоки делят остаток, а блок ссылок берёт свою ширину; не
    // влезает — уходит на следующую строку целиком.
    <footer className="pad-x flex flex-wrap gap-[24px] border-t border-line bg-bg py-[40px] text-[13px] leading-[1.7] text-muted">
      <div className="min-w-0 flex-[1_1_180px]">
        <div className="font-display text-[22px] text-ink">{site.name}</div>
        {site.tagline}
      </div>
      <div className="min-w-0 flex-[1_1_180px]">
        {site.address}
        <br />
        {site.hours}
      </div>
      <div className="min-w-0 flex-[1_1_180px]">
        <a href={site.phoneHref} className="text-ink">
          {site.phone}
        </a>
        <br />
        <a href={site.social.telegram} target="_blank" rel="noreferrer" className="text-accent">
          Telegram
        </a>{" "}
        ·{" "}
        <a href={site.social.instagram} target="_blank" rel="noreferrer" className="text-accent">
          Instagram
        </a>
      </div>
      {/* Две колонки по четыре строки, чтение сверху вниз: семь пунктов
          столбиком были самым длинным блоком подвала. Сертификат — того же
          цвета, что и остальные: в прототипе он выделен --ink, но в списке
          это читалось как сбой, а не как акцент (решение заказчика). */}
      <div className="grid flex-none grid-flow-col grid-rows-4 justify-start gap-x-[24px]">
        {[...site.nav, site.gift].map((n) => (
          <Link key={n.href} href={n.href} className="whitespace-nowrap text-muted">
            {n.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}

export default SiteFooter;
