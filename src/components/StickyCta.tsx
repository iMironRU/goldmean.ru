"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/content/site";
import { usePageCtaVisible } from "@/lib/use-page-cta";

// Sticky-CTA внизу экрана. В прототипе — только на мобильной рамке, и только
// на страницах кроме «Контактов» и «Сертификата»: там своя кнопка отправки
// формы, две кнопки подряд спорили бы друг с другом (§6).
const HIDDEN = ["/contacts", "/gift"];

// Пока главная кнопка самой страницы на экране, панель гаснет — см.
// usePageCtaVisible. На главной в варианте B кнопки совпадали слово в слово.
export function StickyCta() {
  const pathname = usePathname();
  const covered = usePageCtaVisible();

  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (HIDDEN.includes(path)) return null;

  return (
    <div
      className="sticky bottom-0 z-[6] px-[16px] pt-[10px] pb-[14px] transition-opacity duration-200 desktop:hidden"
      style={{
        background: "linear-gradient(to top, var(--bg) 60%, transparent)",
        opacity: covered ? 0 : 1,
        // Скрытая панель не должна перехватывать касания по тому, что под ней.
        pointerEvents: covered ? "none" : undefined,
      }}
      aria-hidden={covered}
    >
      <Link
        href={site.cta.href}
        tabIndex={covered ? -1 : undefined}
        className="btn-primary w-full min-h-[52px] py-[16px]"
        style={{ boxShadow: "0 12px 30px -12px rgba(28,27,25,.5)" }}
      >
        {site.cta.label}
      </Link>
    </div>
  );
}

export default StickyCta;
