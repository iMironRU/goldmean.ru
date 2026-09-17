"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/content/site";

// Sticky-CTA внизу экрана. В прототипе — только на мобильной рамке, и только
// на страницах кроме «Контактов» и «Сертификата»: там своя кнопка отправки
// формы, две кнопки подряд спорили бы друг с другом (§6).
const HIDDEN = ["/contacts", "/gift"];

export function StickyCta() {
  const pathname = usePathname();
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (HIDDEN.includes(path)) return null;

  return (
    <div
      className="sticky bottom-0 z-[6] px-[16px] pt-[10px] pb-[14px] desktop:hidden"
      style={{ background: "linear-gradient(to top, var(--bg) 60%, transparent)" }}
    >
      <Link
        href={site.cta.href}
        className="btn-primary w-full min-h-[52px] p-[16px]"
        style={{ boxShadow: "0 12px 30px -12px rgba(28,27,25,.5)" }}
      >
        {site.cta.label}
      </Link>
    </div>
  );
}

export default StickyCta;
