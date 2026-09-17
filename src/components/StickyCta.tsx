"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/content/site";

// Sticky-CTA внизу экрана. В прототипе — только на мобильной рамке, и только
// на страницах кроме «Контактов» и «Сертификата»: там своя кнопка отправки
// формы, две кнопки подряд спорили бы друг с другом (§6).
const HIDDEN = ["/contacts", "/gift"];

// Пока главная кнопка самой страницы на экране, sticky прячется: иначе рядом
// оказывались две одинаковые акцентные кнопки, ведущие в одно и то же место.
// На главной в варианте B они вообще совпадали слово в слово — «Записаться
// на консультацию» и в первом экране, и внизу.
//
// Кнопки страниц помечены атрибутом data-page-cta. Это явная пометка, а не
// поиск по классу или адресу: так видно, какая кнопка на странице главная,
// и правило не сломается от смены вёрстки кнопки.
const PAGE_CTA = "[data-page-cta]";

export function StickyCta() {
  const pathname = usePathname();
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    // Кнопок может быть несколько (на главной — по одной в каждом варианте),
    // поэтому считаем видимые, а не смотрим на одну.
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setCovered(visible.size > 0);
    });

    document.querySelectorAll(PAGE_CTA).forEach((t) => io.observe(t));

    // Сброс — в уборке, а не в теле эффекта: на странице без своей кнопки
    // наблюдатель не сработает ни разу, и covered должен вернуться к false
    // при уходе с предыдущей страницы.
    return () => {
      io.disconnect();
      setCovered(false);
    };
  }, [pathname]);

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
        className="btn-primary w-full min-h-[52px] p-[16px]"
        style={{ boxShadow: "0 12px 30px -12px rgba(28,27,25,.5)" }}
      >
        {site.cta.label}
      </Link>
    </div>
  );
}

export default StickyCta;
