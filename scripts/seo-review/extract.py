#!/usr/bin/env python3
"""Собирает корпус текстов витрины сайта для SEO-редакторов.

Берёт не json, а собранные страницы из out/ — ровно то, что видят
посетитель и поисковик: <title>, meta description, заголовки (h1–h3 и
div-заголовки .h1-hero / .h2-sec), подписи над ними (.eyebrow) и абзацы.
Тела статей марок и справочников (.prose-doc) пропускаются — их заказчик
решил не трогать. Шапка, подвал и панели показа — тоже: они общие.

Запуск (после `NEXT_PUBLIC_BASE_PATH= npm run build`):
    python3 scripts/seo-review/extract.py > seo-review/corpus.json
"""
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

OUT = Path(__file__).resolve().parents[2] / "out"

# Витрина: всё, что посетитель видит как отдельную страницу, кроме
# заглушек (их тексты ещё не финальные) и карточек товара.
STATIC = ["/", "/watches/", "/jewelry/", "/gift/", "/about/", "/contacts/",
          "/info/garantia/", "/info/harakteristiki/"]

SKIP_TAGS = {"header", "footer", "script", "style", "noscript", "svg", "nav"}
HEAD_CLASSES = ("h1-hero", "h2-sec")


class Collector(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ""
        self.description = ""
        self.blocks = []          # [(kind, text)]
        self._stack = []          # (tag, kind|None, skip, variant|None)
        self._variant = []        # стек вариантов главной (data-home-variant)
        self._buf = None
        self._in_title = False
        self._skip_depth = 0
        self._in_main = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = a.get("class", "") or ""
        if tag == "title":
            self._in_title = True
        if tag == "meta" and a.get("name") == "description":
            self.description = a.get("content", "")
        if tag == "br" and self._buf is not None:
            self._buf.append(" ")   # «Украшения<br>с бриллиантами» — не склеивать
        if tag in ("br", "img", "meta", "link", "input", "hr"):
            return
        if tag == "main":
            self._in_main = True
        skip = tag in SKIP_TAGS or "prose-doc" in cls or "filters-sticky" in cls
        variant = a.get("data-home-variant")
        if variant:
            self._variant.append(variant)
        if skip:
            self._skip_depth += 1
        kind = None
        if self._in_main and not self._skip_depth and self._buf is None:
            if tag in ("h1", "h2", "h3"):
                kind = tag
            elif any(c in cls.split() for c in HEAD_CLASSES):
                # div со стилем заголовка — не заголовок для поиска; помечаем
                # отдельно, иначе редакторы (и мы) примут его за H1
                kind = "заголовок-не-тег"
            elif "eyebrow" in cls.split():
                kind = "подпись"
            elif "font-display" in cls.split() and tag == "div":
                kind = "подзаголовок"
            elif tag in ("p", "blockquote"):
                kind = "текст"
            if kind:
                self._buf = []
                if self._variant:
                    kind = f"{kind} (вариант {self._variant[-1].upper()})"
        self._stack.append((tag, kind, skip, variant))

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        if tag == "main":
            self._in_main = False
        # Закрывающий тег, которого нет на стеке, пропускаем: парсер отдаёт
        # «<img … />» как пару start+end, а img на стек не кладётся — без
        # этой проверки снятие «до совпадающего» вычищало весь стек.
        if not any(t == tag for t, *_ in self._stack):
            return
        # снимаем до совпадающего тега (HTML бывает несбалансирован)
        while self._stack:
            t, kind, skip, variant = self._stack.pop()
            if skip:
                self._skip_depth -= 1
            if variant:
                self._variant.pop()
            if kind and self._buf is not None:
                text = re.sub(r"\s+", " ", "".join(self._buf)).strip()
                if text:
                    self.blocks.append((kind, text))
                self._buf = None
            if t == tag:
                break

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        if self._buf is not None:
            self._buf.append(data)


def page(path):
    f = OUT / path.strip("/") / "index.html" if path != "/" else OUT / "index.html"
    c = Collector()
    c.feed(f.read_text(encoding="utf-8"))
    # подряд идущие дубли (три варианта главной часто повторяют блоки)
    seen, blocks = set(), []
    for k, t in c.blocks:
        if (k, t) in seen:
            continue
        seen.add((k, t))
        if len(t) < 2:
            continue  # «З» — буква-аватар канала в ленте Telegram, не текст
        blocks.append({"вид": k, "текст": t[:600]})
    return {"адрес": path, "title": c.title.strip(), "description": c.description,
            "блоки": blocks}


def brand_pages():
    out = []
    for base in ("watches", "jewelry"):
        for d in sorted((OUT / base).iterdir()):
            idx = d / "index.html"
            if not idx.exists():
                continue
            html = idx.read_text(encoding="utf-8")
            # страница марки — там, где есть шапка марки с хлебными крошками;
            # карточки товара (у украшений в том же сегменте) пропускаем
            if "Все производители" in html or "Все марки" in html:
                out.append(f"/{base}/{d.name}/")
    return out


def main():
    if not (OUT / "index.html").exists():
        sys.exit("Нет out/ — сначала NEXT_PUBLIC_BASE_PATH= npm run build")
    pages = [page(p) for p in STATIC + brand_pages()]
    json.dump(pages, sys.stdout, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
