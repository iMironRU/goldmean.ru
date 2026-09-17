"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { HOME_VARIANT, HOME_VARIANTS, type HomeVariant } from "@/lib/content/site";

// Держит data-home на <html> в согласии с адресом.
//
// Инлайн-скрипт в <head> отрабатывает только при полной загрузке. Переход с
// карточки на /preview и клик по панели показа — мягкие: документ тот же,
// скрипт не перезапускается. Без этой синхронизации адрес говорил «?home=c»,
// а на экране оставался вариант, с которым страницу открыли впервые.
export function HomeVariantSync() {
  const q = useSearchParams().get("home");
  const variant: HomeVariant = (HOME_VARIANTS as readonly string[]).includes(
    q ?? "",
  )
    ? (q as HomeVariant)
    : HOME_VARIANT;

  useEffect(() => {
    document.documentElement.setAttribute("data-home", variant);
  }, [variant]);

  return null;
}

export default HomeVariantSync;
