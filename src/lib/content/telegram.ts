import feed from "../../../content/telegram-feed.json";
import { jewelry } from "@/lib/content/catalog";

// Лента канала, собранная scripts/fetch-telegram.mjs. Файл лежит в
// репозитории, поэтому сборка в сеть не ходит: упади Telegram в момент
// деплоя — на сайте останутся прошлые посты, а не пустая витрина.

export type TelegramPost = {
  id: string;
  url: string;
  text: string;
  date: string | null;
  views: string | null;
  image: string | null;
};

export const telegramPosts: TelegramPost[] = feed.posts;

const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

// Дата абсолютная, а не «сегодня». Страница собирается заранее, и «сегодня»
// на ней означало бы день сборки, а не день просмотра: остановись расписание
// — и подпись начнёт врать.
export function formatPostDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

// «21 просмотр», «24 просмотра», «37 просмотров». Telegram может отдать и
// «1.2K» — тогда склонять нечего, оставляем как есть.
export function formatViews(raw: string | null): string | null {
  if (!raw) return null;
  const n = Number(raw.replace(/\s/g, ""));
  if (!Number.isInteger(n)) return `${raw} просмотров`;

  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} просмотр`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} просмотра`;
  return `${n} просмотров`;
}

export function postMeta(p: TelegramPost): string {
  return [formatPostDate(p.date), formatViews(p.views)].filter(Boolean).join(" · ");
}

/** Заготовка из хендоффа — на случай, если лента ещё ни разу не собиралась. */
export const fallbackPosts = jewelry.telegram.posts;
