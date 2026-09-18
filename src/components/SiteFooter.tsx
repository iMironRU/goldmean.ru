import Link from "next/link";
import { asset } from "@/lib/asset";
import { site } from "@/lib/content/site";

// Подвал (§6 хендоффа). Дисклеймер про Meta — обязателен перед релизом,
// §12 п.4; текст согласуется с заказчиком вместе с проверкой аккаунта.
export function SiteFooter() {
  return (
    // Раскладка: телефон — столбик, планшет — сетка 2×2, десктоп — строка
    // из четырёх блоков по их собственной ширине, промежутки между ними
    // равные (justify-between), крайние прижаты к полям. Не сетка равных
    // колонок: блок ссылок в две колонки — ~274 px, в равной колонке на 1024
    // (206 px) он вылезал за край и давал горизонтальную прокрутку. Слоган
    // ограничен по ширине, чтобы шёл в две строки под логотипом и не
    // растягивал первый блок на треть подвала.
    <footer className="pad-x grid gap-[24px] border-t border-line bg-bg py-[40px] text-[13px] leading-[1.7] text-muted tablet:grid-cols-2 desktop:flex desktop:justify-between desktop:gap-[32px]">
      <div className="max-w-[260px]">
        {/* Логотип, как в шапке на широком экране. Обычный <img> через
            asset(): при статическом экспорте next/image не оптимизирует, а
            basePath в <img> Next сам не подставит. */}
        <Link href="/" aria-label={site.name} className="inline-block">
          <img src={asset(site.logo.full)} alt="" width={228} height={22} className="h-[22px] w-auto" />
        </Link>
        <div className="mt-[8px]">{site.tagline}</div>
      </div>
      <div>
        {site.address}
        <br />
        {site.hours}
      </div>
      <div>
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
      {/* Две колонки по три строки, чтение сверху вниз: слева что купить
          (часы, украшения, сертификат), справа всё о салоне. Порядок задан
          здесь, а не в site.nav: сертификата в меню шапки нет. Цвет у всех
          пунктов один — в прототипе сертификат выделен --ink, но в списке
          это читалось как сбой (решение заказчика). */}
      <div className="grid grid-flow-col grid-rows-3 justify-start gap-x-[24px]">
        {[site.nav[0], site.nav[1], site.gift, ...site.nav.slice(2)].map((n) => (
          <Link key={n.href} href={n.href} className="whitespace-nowrap text-muted">
            {n.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}

export default SiteFooter;
