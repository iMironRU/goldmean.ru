"use client";

import type { ReactNode } from "react";

// Поля формы сертификата. В макете они набраны одинаково во всех блоках:
// подпись капителью 12 px сверху, значение — строка с нижней границей.
// Вынесены сюда, чтобы конструктор читался как форма, а не как стили.

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-[6px] text-[12px] uppercase tracking-[.06em] text-muted">
      {label}
      {children}
    </label>
  );
}

export const inputClass =
  "border-0 border-b border-ink bg-transparent px-0 py-[10px] text-[16px] normal-case tracking-normal text-ink outline-none placeholder:text-muted";

export function Checkbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-[10px] text-[13px] leading-[1.5] text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        aria-hidden
        className="mt-[1px] flex h-[18px] w-[18px] flex-none items-center justify-center border border-ink text-[12px] text-ink"
      >
        {checked ? "✓" : ""}
      </span>
      <span>{children}</span>
    </label>
  );
}

// Чип-переключатель: тот же вид, что у фильтров каталога, но состояние
// локальное, а не в адресе — оформление сертификата ссылкой не передают.
export function Chip({
  active,
  onClick,
  children,
  mono,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  mono?: boolean;
  /** Недоступный вариант: виден, но не выбирается (магазин без украшений). */
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`chip min-h-[44px] px-[16px] py-[12px] text-[13px] disabled:cursor-not-allowed disabled:opacity-40 ${mono ? "font-mono" : ""}`}
      style={
        active
          ? { background: "var(--ink)", borderColor: "var(--ink)", color: "var(--bg)" }
          : undefined
      }
    >
      {children}
    </button>
  );
}
