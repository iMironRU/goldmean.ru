import Link from "next/link";
import { site } from "@/lib/content/site";

// Подвал (§6 хендоффа). Дисклеймер про Meta — обязателен перед релизом,
// §12 п.4; текст согласуется с заказчиком вместе с проверкой аккаунта.
export function SiteFooter() {
  return (
    <footer className="pad-x grid-auto gap-[24px] border-t border-line bg-bg py-[40px] text-[13px] leading-[1.7] text-muted [--col-min:200px]">
      <div>
        <div className="font-display text-[22px] text-ink">{site.name}</div>
        {site.tagline}
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
      <div className="flex flex-col">
        {site.nav.map((n) => (
          <Link key={n.href} href={n.href} className="text-muted">
            {n.label}
          </Link>
        ))}
        <Link href={site.gift.href} className="text-ink">
          {site.gift.label}
        </Link>
      </div>
    </footer>
  );
}

export default SiteFooter;
