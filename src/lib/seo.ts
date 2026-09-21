import type { Metadata } from "next";
import { site } from "@/lib/content/site";

// Заголовок карточки товара: с городом и не длиннее выдачи.
//
// Город обязателен — люди ищут «часы Longines Оренбург». Предел 65 знаков:
// дальше и Яндекс, и Google обрезают заголовок многоточием.
//
// Шаблон корневого layout добавляет « · Золотая середина». У длинных
// названий («Обручальное с бриллиантами — MIUZ Diamonds») пара «город +
// салон» уже не помещается, и тогда жертвуем названием салона: город
// работает на поиск, а салон в заголовке карточки — просто подпись.
const LIMIT = 65;
const SUFFIX = ` · ${site.name}`;

export function cityTitle(base: string): Metadata["title"] {
  const withCity = `${base} в ${site.city}е`;
  return withCity.length + SUFFIX.length <= LIMIT
    ? withCity
    : { absolute: withCity };
}
