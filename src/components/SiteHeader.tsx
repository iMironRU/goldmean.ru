"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/content/site";
import { activeNavHref } from "@/lib/active-nav";

// Шапка: sticky, 72 px на десктопе и 60 px на мобильном, фон — полупрозрачный
// --bg с blur (§6 хендоффа).
export function SiteHeader() {
  const pathname = usePathname();
  const active = activeNavHref(pathname);
  const [menu, setMenu] = useState(false);

  // Меню открыто — страница под ним не должна прокручиваться.
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  return (
    <>
      <header
        className="sticky top-0 z-[5] border-b border-line"
        style={{
          background: "color-mix(in srgb, var(--bg) 94%, transparent)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="pad-x flex h-[60px] items-center justify-between gap-4 desktop:h-[72px]">
          <Link
            href="/"
            className="whitespace-nowrap font-display text-[20px] font-medium tracking-[.02em] text-ink desktop:text-[24px]"
          >
            {site.name}
          </Link>

          {/* Десктоп: шесть пунктов и кнопка записи */}
          <nav className="hidden gap-[28px] desktop:flex">
            {site.nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="border-b py-[6px] text-[13px] tracking-[.04em] transition-colors"
                style={{
                  color: active === n.href ? "var(--ink)" : "var(--muted)",
                  borderColor: active === n.href ? "var(--ink)" : "transparent",
                }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Link
            href={site.cta.href}
            className="btn-primary btn-primary-nav hidden desktop:inline-flex"
          >
            {site.cta.label}
          </Link>

          {/* Мобильный: бургер 44×44, три полоски 16×1 */}
          <button
            type="button"
            aria-label="Меню"
            aria-expanded={menu}
            onClick={() => setMenu((v) => !v)}
            className="flex h-[44px] w-[44px] flex-col items-center justify-center gap-[4px] border border-line2 bg-transparent desktop:hidden"
          >
            <span className="block h-px w-4 bg-ink" />
            <span className="block h-px w-4 bg-ink" />
            <span className="block h-px w-4 bg-ink" />
          </button>
        </div>
      </header>

      {/* Оверлей меню — СНАРУЖИ <header>.
          У шапки есть backdrop-filter, а он делает элемент содержащим блоком
          для position:fixed внутри. Пока меню жило в шапке, его inset-0 считался
          от её 60 px: пункты рисовались поверх страницы, а фон обрывался под
          шапкой. */}
      {menu && (
        <div className="fade-up fixed inset-0 z-20 flex flex-col bg-bg px-[20px] py-[24px] desktop:hidden">
          <div className="mb-[40px] flex items-center justify-between">
            <span className="font-display text-[22px]">Меню</span>
            <button
              type="button"
              aria-label="Закрыть меню"
              onClick={() => setMenu(false)}
              className="h-[44px] w-[44px] border border-line2 bg-transparent text-[18px]"
            >
              ×
            </button>
          </div>
          <nav className="flex flex-col gap-[6px]">
            {site.nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMenu(false)}
                className="border-b border-line py-[8px] font-display text-[34px] text-ink"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto text-[13px] leading-[1.7] text-muted">
            {site.addressShort}
            <br />
            {site.hours}
            <br />
            <a href={site.phoneHref} className="text-ink">
              {site.phone}
            </a>
            <br />
            <a href={site.social.telegram} target="_blank" rel="noreferrer" className="text-accent">
              Telegram
            </a>{" "}
            ·{" "}
            <a href={site.social.instagram} target="_blank" rel="noreferrer" className="text-accent">
              Instagram
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export default SiteHeader;
