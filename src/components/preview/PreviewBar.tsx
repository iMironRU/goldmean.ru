"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { HOME_VARIANTS, preview, type HomeVariant } from "@/lib/content/site";
import {
  getPreviewServerSnapshot,
  getPreviewSnapshot,
  setPreviewVariant,
  subscribePreview,
} from "@/lib/preview-mode";

// Плавающая панель показа: переключение вариантов главной и возврат к выбору.
//
// Режим включается переходом со страницы /preview — она ставит ?home=. Дальше
// вариант живёт в sessionStorage, поэтому панель остаётся видна и в каталоге,
// и на любой другой странице: иначе, нажав «Смотреть каталог», заказчик терял
// бы путь назад к выбору.
//
// Обычный посетитель панель не увидит: включить режим можно только со
// страницы показа, а она удаляется перед релизом вместе с этой панелью.
// Крестик выключает режим и очищает хранилище.
//
// Внутри iframe панель не рисуется — миниатюры на /preview показывают сам
// макет, а не инструмент показа поверх него.
export function PreviewBar() {
  const q = useSearchParams().get("home");
  const fromUrl: HomeVariant | null = (HOME_VARIANTS as readonly string[]).includes(
    q ?? "",
  )
    ? (q as HomeVariant)
    : null;

  const stored = useSyncExternalStore(
    subscribePreview,
    getPreviewSnapshot,
    getPreviewServerSnapshot,
  );

  // Адрес главнее хранилища: открыли ?home=c — значит показываем C и
  // запоминаем его на остальные страницы.
  useEffect(() => {
    if (fromUrl && fromUrl !== stored) setPreviewVariant(fromUrl);
  }, [fromUrl, stored]);

  const variant = fromUrl ?? (stored as HomeVariant | null);

  // Рендер здесь всегда клиентский (layout оборачивает в Suspense), window есть.
  const inIframe = typeof window !== "undefined" && window.self !== window.top;

  if (!variant || !(HOME_VARIANTS as readonly string[]).includes(variant) || inIframe) {
    return null;
  }

  const current = preview.variants.find((v) => v.key === variant);

  return (
    <div
      className="fixed bottom-[92px] left-[16px] right-[16px] z-[7] flex flex-wrap items-center gap-[10px] rounded-[3px] border border-line2 bg-bg px-[14px] py-[10px] desktop:bottom-[20px] desktop:left-[20px] desktop:right-auto desktop:gap-[12px]"
      style={{ boxShadow: "0 18px 40px -18px rgba(28,27,25,.45)" }}
    >
      <Link
        href="/preview"
        className="flex min-h-[36px] items-center text-[12px] font-medium uppercase tracking-[.1em] text-muted transition-colors hover:text-ink"
      >
        ← К выбору
      </Link>

      <span className="h-[20px] w-px bg-line" />

      <span className="text-[12px] text-muted">Главная:</span>

      <div className="flex flex-wrap gap-[6px]">
        {preview.variants.map((v) => {
          const active = v.key === variant;
          return (
            <Link
              key={v.key}
              href={`/?home=${v.key}`}
              title={v.text}
              aria-current={active ? "true" : undefined}
              className="chip"
            >
              {v.key.toUpperCase()} · {v.name}
            </Link>
          );
        })}
      </div>

      {current ? (
        <span className="hidden max-w-[320px] text-[12px] leading-[1.5] text-muted wide:inline">
          {current.text}
        </span>
      ) : null}

      <button
        type="button"
        onClick={() => setPreviewVariant(null)}
        aria-label="Выйти из режима показа"
        title="Выйти из режима показа"
        className="ml-auto flex h-[28px] w-[28px] flex-none items-center justify-center rounded-[3px] border border-line2 bg-transparent text-[14px] text-muted transition-colors hover:border-ink hover:text-ink"
      >
        ×
      </button>
    </div>
  );
}

export default PreviewBar;
