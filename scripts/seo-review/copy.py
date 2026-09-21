#!/usr/bin/env python3
"""Варианты заголовков и призывов для главной: два автора, фактчек, выбор
покупателя.

  1. Копирайтеры (параллельно): GPT и Gemini — по 5 вариантов на место.
  2. Длина — проверка кодом по ограничениям из slots-home.json.
  3. Фактчек — DeepSeek по facts.md: выдумки о салоне.
  4. Покупатель — Gemini выбирает 3 лучших на место. Авторство скрыто:
     варианты перемешаны и пронумерованы, иначе модель тянет к своим.

    python3 scripts/seo-review/copy.py [--env …/.env]

Результат: seo-review/<дата>/copy-home.json (всё) и copy-home.md (читать).
"""
import argparse
import json
import random
import re
import sys
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import review  # noqa: E402 — те же вызовы моделей и загрузка ключей

ROOT = review.ROOT
PROMPTS = HERE / "prompts"


def as_json(text):
    """Модели иногда оборачивают JSON в ```json … ``` — снимаем обёртку."""
    m = re.search(r"\{.*\}", text, re.S)
    if not m:
        raise ValueError(f"нет JSON в ответе: {text[:200]}")
    return json.loads(m.group(0))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--env", type=Path, default=review.DEFAULT_ENV)
    ap.add_argument("--slots", default="scripts/seo-review/slots-home.json")
    args = ap.parse_args()
    review.load_env(args.env)

    slots = json.loads((ROOT / args.slots).read_text())["slots"]
    facts = (HERE / "facts.md").read_text()
    out = ROOT / "seo-review" / date.today().isoformat()
    out.mkdir(parents=True, exist_ok=True)

    brief = f"# ФАКТЫ\n{facts}\n\n# МЕСТА\n{json.dumps(slots, ensure_ascii=False, indent=1)}"
    writer = (PROMPTS / "copywriter.md").read_text()

    # 1. Два автора параллельно
    with ThreadPoolExecutor(max_workers=2) as ex:
        f_gpt = ex.submit(review.openai, writer, brief)
        f_gem = ex.submit(review.gemini, writer + "\n\nПиши своим голосом, не повторяй очевидное.", brief)
        drafts = {"gpt": as_json(f_gpt.result()), "gemini": as_json(f_gem.result())}
    print("авторы: готово", flush=True)

    # 2. Сводим, нумеруем вперемешку, проверяем длину
    limits = {s["id"]: s["ограничения"] for s in slots}
    pool = {}
    for author, d in drafts.items():
        for s in d["slots"]:
            for v in s["variants"]:
                pool.setdefault(s["id"], []).append({"author": author, **v})
    rng = random.Random(21)
    items, over = {}, {}
    for sid, vs in pool.items():
        rng.shuffle(vs)
        for i, v in enumerate(vs, 1):
            key = f"{sid}-{i}"
            v["key"] = key
            items[key] = v
            long = [f"{k}: {len(t)} > {limits[sid].get(k)}" for k, t in v["части"].items()
                    if limits[sid].get(k) and len(t) > limits[sid][k]]
            if long:
                over[key] = "длиннее ограничения — " + "; ".join(long)

    anon = {sid: [{"key": v["key"], "части": v["части"]} for v in vs] for sid, vs in pool.items()}

    # 3. Фактчек
    fc = as_json(review.deepseek((PROMPTS / "copy-facts.md").read_text(),
                                 f"# ФАКТЫ\n{facts}\n\n# ОГРАНИЧЕНИЯ\n{json.dumps(limits, ensure_ascii=False)}\n\n"
                                 f"# ВАРИАНТЫ\n{json.dumps(anon, ensure_ascii=False, indent=1)}"))
    flagged = {f["key"]: f["почему"] for f in fc.get("flags", [])}
    flagged.update(over)
    print(f"фактчек: отсеяно {len(flagged)} из {len(items)}", flush=True)

    # 4. Покупатель выбирает из чистых
    clean = {sid: [v for v in vs if v["key"] not in flagged] for sid, vs in anon.items()}
    picks = as_json(review.gemini((PROMPTS / "picker.md").read_text(),
                                  json.dumps({"места": [{"id": s["id"], "где": s["где"]} for s in slots],
                                              "варианты": clean}, ensure_ascii=False, indent=1)))
    print("покупатель: готово", flush=True)

    result = {"slots": slots, "items": items, "flagged": flagged, "picks": picks}
    (out / "copy-home.json").write_text(json.dumps(result, ensure_ascii=False, indent=1))

    # Читаемый отчёт
    lines = ["# Варианты для главной — сырой отчёт", ""]
    for s in slots:
        sid = s["id"]
        lines += [f"## {sid}", "", f"**Сейчас:** " + " · ".join(f"{k}: «{t}»" for k, t in s["части"].items()), ""]
        top = next((p for p in picks.get("slots", []) if p["id"] == sid), {"top": [], "фальшиво": []})
        for rank, t in enumerate(top.get("top", []), 1):
            v = items.get(t["key"])
            if not v:
                continue
            parts = " · ".join(f"{k}: «{x}»" for k, x in v["части"].items())
            lines.append(f"{rank}. **{t['key']}** ({v['author']}) — {parts}  \n   _покупатель:_ {t['почему']}")
        lines += ["", "<details><summary>Все варианты</summary>", ""]
        for v in pool.get(sid, []):
            mark = f" — ❌ {flagged[v['key']]}" if v["key"] in flagged else ""
            fake = " — 🙁 фальшиво" if v["key"] in top.get("фальшиво", []) else ""
            parts = " · ".join(f"{k}: «{x}»" for k, x in v["части"].items())
            lines.append(f"- {v['key']} ({v['author']}): {parts}{mark}{fake}")
        lines += ["", "</details>", ""]
    (out / "copy-home.md").write_text("\n".join(lines))
    print(f"Отчёт: {(out / 'copy-home.md').relative_to(ROOT)}")


if __name__ == "__main__":
    main()
