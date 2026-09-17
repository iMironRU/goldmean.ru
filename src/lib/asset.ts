// Префикс basePath для адресов, на которые НЕ распространяется авто-префикс
// Next.js: обычный <a href="/файл.pdf">, url(...) в inline-стилях, <iframe src>.
// Для next/link, next/image и src на статику из public basePath добавляется сам.
//
// Локально basePath пуст, поэтому забытый asset() здесь не видно — ошибка
// вылезет только на Pages, где сайт живёт по /goldmean.ru.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
