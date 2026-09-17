"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HOME_VARIANTS, preview, type HomeVariant } from "@/lib/content/site";

// Плавающая панель показа: переключение вариантов главной и возврат к выбору.
//
// Появляется только когда в адресе есть ?home= — то есть когда страницу
// открыли со страницы выбора /preview. Обычный посетитель сайта её не увидит,
// и убирать её перед релизом отдельно не придётся: уйдёт вместе с /preview.
//
// Внутри iframe панель не рисуется: миниатюры на /preview показывают сам
// макет, а не инструмент показа поверх него.
//
// useSearchParams, а не чтение location в эффекте: переход между ?home=a и
// ?home=b не меняет pathname, и панель не узнала бы о смене варианта —
// подсветка активной кнопки залипла бы на первом открытом. Обёртка в Suspense
// обязательна и стоит в layout: при статическом экспорте сервер query не
// знает и на этапе сборки рисует fallback.
export function PreviewBar() {
  const params = useSearchParams();
  const q = params.get("home");

  const variant: HomeVariant | null = (
    HOME_VARIANTS as readonly string[]
  ).includes(q ?? "")
    ? (q as HomeVariant)
    : null;

  // Рендер здесь всегда клиентский (см. Suspense выше), поэтому window есть.
  const inIframe = typeof window !== "undefined" && window.self !== window.top;

  if (!variant || inIframe) return null;

  const current = preview.variants.find((v) => v.key === variant);

  return (
    <div
      className="fixed bottom-[92px] left-[16px] right-[16px] z-[7] flex flex-wrap items-center gap-[10px] rounded-[3px] border border-line2 bg-bg px-[14px] py-[10px] desktop:bottom-[20px] desktop:left-[20px] desktop:right-auto desktop:gap-[12px]"
      style={{ boxShadow: "0 18px 40px -18px rgba(28,27,25,.45)" }}
    >
      <Link
        href="/preview"
        className="flex min-h-[36px] items-center gap-[8px] text-[12px] font-medium uppercase tracking-[.1em] text-muted transition-colors hover:text-ink"
      >
        ← К выбору
      </Link>

      <span className="h-[20px] w-px bg-line" />

      <span className="text-[12px] text-muted">Главная:</span>

      <div className="flex gap-[6px]">
        {preview.variants.map((v) => {
          const active = v.key === variant;
          return (
            <Link
              key={v.key}
              href={`/?home=${v.key}`}
              title={v.text}
              aria-current={active ? "true" : undefined}
              className="flex min-h-[36px] items-center rounded-[3px] border px-[12px] text-[12px] transition-colors"
              style={{
                borderColor: active ? "var(--ink)" : "var(--line2)",
                background: active ? "var(--ink)" : "transparent",
                color: active ? "var(--bg)" : "var(--ink)",
              }}
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
    </div>
  );
}

export default PreviewBar;
