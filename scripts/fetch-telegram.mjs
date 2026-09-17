// Забирает последние посты публичного канала Telegram и кладёт их в
// content/telegram-feed.json, а картинки — в public/telegram/.
//
// Почему так, а не запрос во время сборки: сборка на GitHub Pages не должна
// ходить в сеть. Упади Telegram в момент деплоя — сайт собрался бы с пустой
// витриной. Здесь же результат лежит в репозитории, виден в ревью, а при
// неудачной выкачке скрипт ничего не трогает и на сайте остаются прошлые
// посты.
//
// Запускается по расписанию из .github/workflows/telegram.yml и вручную:
//   node scripts/fetch-telegram.mjs
//
// Разбор идёт по HTML публичного превью t.me/s/<канал> — официального
// способа прочитать историю канала без бота-администратора нет. Telegram не
// обещает не менять эту разметку, поэтому при пустом разборе скрипт выходит
// с ошибкой, а не переписывает файл пустотой.

import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);

const CHANNEL = process.env.TG_CHANNEL || "zolotayaseredina_orenburg";
const LIMIT = Number(process.env.TG_LIMIT || 3);

const ROOT = process.cwd();
const OUT_JSON = path.join(ROOT, "content", "telegram-feed.json");
const OUT_IMG = path.join(ROOT, "public", "telegram");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";

// Качаем через curl, а не fetch. Причина приземлённая: fetch в Node не
// читает переменные HTTPS_PROXY, и за прокси скрипт молча падает по
// таймауту. curl их учитывает, есть и на macOS, и на runner'е GitHub, и не
// тянет за собой зависимость.
async function curl(url, file) {
  const args = ["-sSL", "--max-time", "30", "-A", UA, url];
  if (file) {
    await run("curl", [...args, "-o", file]);
    return null;
  }
  const { stdout } = await run("curl", args, { maxBuffer: 64 * 1024 * 1024 });
  return stdout;
}

function stripTags(html) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parse(html) {
  // Режем страницу на посты по обёртке сообщения.
  const chunks = html.split('class="tgme_widget_message_wrap').slice(1);

  return chunks.flatMap((chunk) => {
    const id = chunk.match(/data-post="[^/]+\/(\d+)"/)?.[1];
    if (!id) return [];

    const textHtml = chunk.match(
      /class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/,
    )?.[1];
    const text = textHtml ? stripTags(textHtml) : "";
    if (!text) return []; // посты без подписи витрине не нужны

    const date = chunk.match(/<time datetime="([^"]+)"/)?.[1] ?? null;
    const views = chunk.match(
      /class="tgme_widget_message_views">([^<]+)</,
    )?.[1] ?? null;
    const photo = chunk.match(
      /tgme_widget_message_photo_wrap[^>]*background-image:url\('([^']+)'\)/,
    )?.[1] ?? null;

    return [{ id, text, date, views, photo }];
  });
}

async function main() {
  const html = await curl(`https://t.me/s/${CHANNEL}`);
  const all = parse(html);
  if (!all.length) {
    throw new Error(
      "не разобрал ни одного поста — вероятно, Telegram поменял разметку превью",
    );
  }

  // На странице посты идут от старых к новым.
  const newestFirst = all.reverse();

  // В витрину берём посты СО СНИМКАМИ: блок называется «Что сейчас в
  // витрине», и пустая рамка с подписью «пост без фотографии» читается там
  // как поломка. Если снимков не набралось — добираем текстовыми, чтобы
  // блок не остался полупустым.
  const withPhoto = newestFirst.filter((p) => p.photo);
  const posts = [...withPhoto, ...newestFirst.filter((p) => !p.photo)].slice(0, LIMIT);

  await fs.mkdir(OUT_IMG, { recursive: true });

  const out = [];
  for (const p of posts) {
    let image = null;
    if (p.photo) {
      const name = `${p.id}.jpg`;
      try {
        await curl(p.photo, path.join(OUT_IMG, name));
        image = `/telegram/${name}`;
      } catch (e) {
        console.warn(`  картинка поста ${p.id} не скачалась: ${e.message}`);
      }
    }
    out.push({
      id: p.id,
      url: `https://t.me/${CHANNEL}/${p.id}`,
      text: p.text,
      date: p.date,
      views: p.views,
      image,
    });
  }

  // Убираем картинки постов, которых в ленте уже нет: иначе public/telegram
  // растёт бесконечно.
  const keep = new Set(out.map((p) => p.image && path.basename(p.image)));
  for (const f of await fs.readdir(OUT_IMG)) {
    if (!keep.has(f)) await fs.unlink(path.join(OUT_IMG, f));
  }

  // Метки времени в файле нет намеренно. С ней он менялся при каждом запуске
  // даже тогда, когда канал молчал, — и расписание коммитило и пересобирало
  // сайт раз в час впустую. Когда лента обновлялась, видно по истории git.
  await fs.writeFile(
    OUT_JSON,
    JSON.stringify({ channel: CHANNEL, posts: out }, null, 2) + "\n",
  );

  console.log(`постов: ${out.length}, с картинками: ${out.filter((p) => p.image).length}`);
  for (const p of out) console.log(`  ${p.id} · ${p.text.slice(0, 60).replace(/\n/g, " ")}…`);
}

main().catch((e) => {
  console.error(`не обновил ленту: ${e.message}`);
  console.error("прошлые данные оставлены нетронутыми");
  process.exit(1);
});
