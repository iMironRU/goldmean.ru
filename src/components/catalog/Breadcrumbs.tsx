import Link from "next/link";

export type Crumb = { href?: string; label: string };

// Хлебные крошки карточки товара и страницы марки (§7 хендоффа).
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="pad-x flex flex-wrap gap-[8px] pt-[20px] text-[12px] text-muted">
      {items.map((c, i) => (
        <span key={c.label} className="flex gap-[8px]">
          {c.href ? (
            <Link href={c.href} className="text-muted transition-colors hover:text-ink">
              {c.label}
            </Link>
          ) : (
            <span className="text-ink">{c.label}</span>
          )}
          {i < items.length - 1 ? <span aria-hidden>/</span> : null}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumbs;
