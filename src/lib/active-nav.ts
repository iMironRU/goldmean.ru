// Какой пункт меню подсвечен на данном адресе.
//
// Совпадение не буквальное: страница мастера подсвечивает «Часы», а «О
// бриллиантах» и карточка изделия — «Украшения» (§6 хендоффа). Правило живёт
// здесь одно на всех, чтобы шапка и подвал не разошлись.
const RULES: Array<[RegExp, string]> = [
  [/^\/watches(\/|$)/, "/watches"],
  [/^\/master(\/|$)/, "/watches"],
  [/^\/jewelry(\/|$)/, "/jewelry"],
  [/^\/diamonds(\/|$)/, "/jewelry"],
  [/^\/why-offline(\/|$)/, "/why-offline"],
  [/^\/about(\/|$)/, "/about"],
  [/^\/contacts(\/|$)/, "/contacts"],
];

export function activeNavHref(pathname: string): string | null {
  // trailingSlash: true — адрес приходит как «/watches/», нормализуем.
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  for (const [re, href] of RULES) {
    if (re.test(path)) return href;
  }
  return null;
}
