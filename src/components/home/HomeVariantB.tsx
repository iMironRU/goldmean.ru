import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";
import { home, HOME_VARIANT, site } from "@/lib/content/site";

// Вариант «b» — редакционный. Крупный текстовый заголовок и CTA, ниже две
// карточки 4:5 с подписями (§3.1).
export function HomeVariantB() {
  const v = home.b;
  // H1 — только у варианта по умолчанию: в HTML лежат все три первых
  // экрана, и поиск видел бы три H1 на одной странице.
  const Title = HOME_VARIANT === "b" ? "h1" : "div";

  return (
    <>
      <div className="pad-x pad-t pb-[24px]">
        <Title className="h1-hero max-w-[900px]">{v.title}</Title>
        <div className="mt-[28px] flex flex-wrap items-center gap-[12px]">
          <Link href={site.cta.href} data-page-cta className="btn-primary">
            {site.cta.label}
          </Link>
          <span className="text-[13px] text-muted">
            {site.hours} · {site.phone}
          </span>
        </div>
      </div>

      <div className="pad-x grid-auto gap-[24px] pt-[24px]">
        {[
          { href: "/watches", card: v.watches, tone: "cool" as const, bg: "bg-cool" },
          { href: "/jewelry", card: v.jewelry, tone: "warm" as const, bg: "bg-warm2" },
        ].map(({ href, card, tone, bg }) => (
          <Link key={href} href={href} className="block">
            <div className={`aspect-4/5 ${bg}`}>
              <ImageSlot photo={card.photo} src={card.src} tone={tone} />
            </div>
            <div className="mt-[14px] flex items-baseline justify-between gap-[16px] border-b border-ink pb-[12px]">
              <span className="h2-sec text-ink">{card.title}</span>
              <span className="shrink-0 text-[12px] font-medium uppercase tracking-[.1em] text-ink">
                {card.action}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default HomeVariantB;
