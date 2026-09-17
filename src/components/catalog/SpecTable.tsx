import Link from "next/link";

export type Spec = {
  k: string;
  v: string;
  /** Внутренний адрес: значение станет ссылкой (например, на /info/garantia). */
  href?: string;
};

// Таблица характеристик в карточке товара (§7 хендоффа): две колонки,
// 140 px под название, строки разделены линиями.
export function SpecTable({ specs }: { specs: Spec[] }) {
  return (
    <dl className="mt-[36px] border-t border-ink">
      {specs.map((s) => (
        <div
          key={s.k}
          className="grid grid-cols-[110px_1fr] gap-[16px] border-b border-line py-[12px] text-[14px] desktop:grid-cols-[140px_1fr]"
        >
          <dt className="text-muted">{s.k}</dt>
          <dd className="m-0">
            {s.href ? (
              <Link href={s.href} className="text-ink underline decoration-line2 underline-offset-4 transition-colors hover:decoration-ink">
                {s.v}
              </Link>
            ) : (
              s.v
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default SpecTable;
