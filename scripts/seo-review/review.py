#!/usr/bin/env python3
"""SEO- и редакторский прогон текстов витрины сайта.

По образцу «обоймы редакторов» из me-books/book-template/scripts/review.py:
каждый редактор видит только свою ось.

  Этап 1 (параллельно):
    GPT      — SEO: title, description, H1, запросы, каннибализация
    GPT      — «для людей»: понятность, канцелярит, штампы, тон
    Gemini   — придирчивый покупатель из Оренбурга
  Этап 2:
    DeepSeek — фактчек текущих текстов И предложений этапа 1 по facts.md
               (чтобы SEO не приписал салону доставку, скидки и т. п.)

Корпус собирает extract.py из out/. Ключи — из .env книги (DEEPSEEK_API_KEY,
OPENAI_API_KEY, GEMINI_API_KEY); в репозиторий сайта .env не копируется.

    NEXT_PUBLIC_BASE_PATH= npm run build
    python3 scripts/seo-review/extract.py > seo-review/corpus.json
    python3 scripts/seo-review/review.py [--env ~/…/.env]

Отчёты: seo-review/<дата>/<редактор>-<пачка>.md. Сводку собирает человек
(или Claude) — отчёты это предложения, а не правки.
"""
import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
PROMPTS = HERE / "prompts"
DEFAULT_ENV = Path.home() / "Documents/me-books/1c/1c-reading-forms/.env"
GPT_MODEL = os.environ.get("OPENAI_MODEL", "gpt-5")
GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")


def load_env(path):
    if not path.exists():
        sys.exit(f"Нет {path}")
    for line in path.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())


def post(url, headers, body, timeout=900, retries=3):
    data = json.dumps(body).encode()
    for attempt in range(retries):
        req = urllib.request.Request(url, data=data, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            msg = f"HTTP {e.code}: {e.read().decode(errors='replace')[:800]}"
            if e.code in (429, 500, 502, 503) and attempt < retries - 1:
                time.sleep(15 * (attempt + 1))
                continue
            raise RuntimeError(msg) from None


def openai(system, user):
    body = {"model": GPT_MODEL, "messages": [
        {"role": "system", "content": system}, {"role": "user", "content": user}]}
    # у gpt-5 в лимит входят и токены рассуждения — даём с запасом
    body["max_completion_tokens"] = 32000
    r = post("https://api.openai.com/v1/chat/completions",
             {"Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}",
              "Content-Type": "application/json"}, body)
    return r["choices"][0]["message"]["content"]


def deepseek(system, user):
    body = {"model": "deepseek-chat", "temperature": 0.2, "max_tokens": 8000,
            "messages": [{"role": "system", "content": system},
                         {"role": "user", "content": user}]}
    r = post("https://api.deepseek.com/v1/chat/completions",
             {"Authorization": f"Bearer {os.environ['DEEPSEEK_API_KEY']}",
              "Content-Type": "application/json"}, body)
    return r["choices"][0]["message"]["content"]


def gemini(system, user):
    url = (f"https://generativelanguage.googleapis.com/v1beta/models/"
           f"{GEMINI_MODEL}:generateContent?key={os.environ['GEMINI_API_KEY']}")
    body = {"systemInstruction": {"parts": [{"text": system}]},
            "contents": [{"role": "user", "parts": [{"text": user}]}],
            "generationConfig": {"temperature": 0.4, "maxOutputTokens": 32000}}
    r = post(url, {"Content-Type": "application/json"}, body)
    parts = r["candidates"][0]["content"]["parts"]
    return "".join(p.get("text", "") for p in parts)


def batches(corpus):
    import re as _re
    card = _re.compile(r"^/watches/[^/]+/[^/]+/$|^/jewelry/[a-z]\d+/$")
    cards_w = [p for p in corpus if p["адрес"].startswith("/watches/") and card.match(p["адрес"])]
    cards_j = [p for p in corpus if p["адрес"].startswith("/jewelry/") and card.match(p["адрес"])]
    rest = [p for p in corpus if p not in cards_w and p not in cards_j]
    main = [p for p in rest if p["адрес"].count("/") <= 2 or p["адрес"].startswith("/info/")]
    watches = [p for p in rest if p["адрес"].startswith("/watches/") and p not in main]
    jewelry = [p for p in rest if p["адрес"].startswith("/jewelry/") and p not in main]
    out = {"основные": main, "часовые-марки": watches, "ювелирные-марки": jewelry,
           "карточки-часов": cards_w, "карточки-украшений": cards_j}
    return {k: v for k, v in out.items() if v}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--env", type=Path, default=DEFAULT_ENV)
    ap.add_argument("--corpus", default="seo-review/corpus.json")
    ap.add_argument("--only", help="одна пачка: основные | часовые-марки | ювелирные-марки | карточки-часов | карточки-украшений")
    args = ap.parse_args()
    load_env(args.env)

    corpus = json.loads((ROOT / args.corpus).read_text())
    facts = (HERE / "facts.md").read_text()
    common = (PROMPTS / "common.md").read_text()
    out = ROOT / "seo-review" / date.today().isoformat()
    out.mkdir(parents=True, exist_ok=True)

    todo = batches(corpus)
    if args.only:
        todo = {args.only: todo[args.only]}

    def user_msg(name, pages, extra=""):
        return (f"ПАЧКА: {name}\n\n# ФАКТЫ\n{facts}\n\n# КОРПУС\n"
                f"{json.dumps(pages, ensure_ascii=False, indent=1)}\n{extra}")

    def run(tag, fn, role, name, pages, extra=""):
        path = out / f"{tag}-{name}.md"
        t0 = time.time()
        try:
            text = fn(common + "\n\n" + (PROMPTS / role).read_text(), user_msg(name, pages, extra))
            path.write_text(text)
            return f"ok   {path.name:<34} {time.time() - t0:5.0f} с  {len(text):>6} зн."
        except Exception as e:  # noqa: BLE001 — отчёт об ошибке вместо падения всей обоймы
            path.with_suffix(".error.txt").write_text(str(e))
            return f"FAIL {path.name:<34} {str(e)[:160]}"

    # Этап 1 — параллельно по всем пачкам
    jobs = []
    with ThreadPoolExecutor(max_workers=9) as ex:
        for name, pages in todo.items():
            jobs += [ex.submit(run, "seo", openai, "seo.md", name, pages),
                     ex.submit(run, "human", openai, "human.md", name, pages),
                     ex.submit(run, "reader", gemini, "reader.md", name, pages)]
        for j in jobs:
            print(j.result(), flush=True)

    # Этап 2 — фактчек текстов и предложений этапа 1
    def stage1(name):
        parts = []
        for tag in ("seo", "human", "reader"):
            p = out / f"{tag}-{name}.md"
            if p.exists():
                parts.append(f"\n\n# ПРЕДЛОЖЕНИЯ РЕДАКТОРА «{tag}»\n{p.read_text()}")
        return "".join(parts)

    with ThreadPoolExecutor(max_workers=3) as ex:
        for r in ex.map(lambda kv: run("facts", deepseek, "facts.md", kv[0], kv[1], stage1(kv[0])),
                        todo.items()):
            print(r, flush=True)
    print(f"\nОтчёты: {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
