import Link from "next/link";

// Название марки. Если для неё есть страница — ссылка, иначе просто текст.
//
// Отдельный компонент, чтобы правило «упоминание марки ведёт на её страницу»
// выполнялось одинаково во всех местах: в шапке карточки товара, в подписи
// под фото в каталоге, в блоке похожих и в строке «Производитель».
export function BrandLink({
  name,
  href,
  className = "",
}: {
  name: string;
  href?: string;
  className?: string;
}) {
  if (!href) return <span className={className}>{name}</span>;

  return (
    <Link href={href} className={`${className} transition-colors hover:text-accent`}>
      {name}
    </Link>
  );
}

export default BrandLink;
