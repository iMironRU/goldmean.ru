"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Видна ли сейчас на экране главная кнопка самой страницы.
//
// Общие кнопки записи — sticky-панель внизу на мобильном и кнопка в шапке на
// десктопе — гаснут, пока кнопка страницы в кадре: иначе рядом оказывались
// две акцентные кнопки, ведущие в одно и то же место. Правило одно для обеих,
// поэтому и наблюдатель один.
//
// Кнопки страниц помечены атрибутом data-page-cta. Это явная пометка, а не
// поиск по классу или адресу: так видно, какая кнопка на странице главная, и
// правило не сломается от смены вёрстки кнопки.
const PAGE_CTA = "[data-page-cta]";

export function usePageCtaVisible(): boolean {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Кнопок может быть несколько (на главной — по одной в каждом варианте),
    // поэтому считаем видимые, а не смотрим на одну.
    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) seen.add(e.target);
        else seen.delete(e.target);
      }
      setVisible(seen.size > 0);
    });

    document.querySelectorAll(PAGE_CTA).forEach((t) => io.observe(t));

    // Сброс — в уборке, а не в теле эффекта: на странице без своей кнопки
    // наблюдатель не сработает ни разу, и значение должно вернуться к false
    // при уходе с предыдущей страницы.
    return () => {
      io.disconnect();
      setVisible(false);
    };
  }, [pathname]);

  return visible;
}
