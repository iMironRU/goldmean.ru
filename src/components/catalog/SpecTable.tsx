// Таблица характеристик в карточке товара (§7 хендоффа): две колонки,
// 140 px под название, строки разделены линиями.
export function SpecTable({ specs }: { specs: { k: string; v: string }[] }) {
  return (
    <dl className="mt-[36px] border-t border-ink">
      {specs.map((s) => (
        <div
          key={s.k}
          className="grid grid-cols-[110px_1fr] gap-[16px] border-b border-line py-[12px] text-[14px] desktop:grid-cols-[140px_1fr]"
        >
          <dt className="text-muted">{s.k}</dt>
          <dd className="m-0">{s.v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default SpecTable;
