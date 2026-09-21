import { Suspense } from "react";
import { HomeVariantA } from "@/components/home/HomeVariantA";
import { HomeVariantB } from "@/components/home/HomeVariantB";
import { HomeVariantC } from "@/components/home/HomeVariantC";
import { HomeVariantSync } from "@/components/home/HomeVariantSync";
import { TrustBlock } from "@/components/home/TrustBlock";
import { WhyInStore } from "@/components/home/WhyInStore";
import { home, HOME_VARIANT } from "@/lib/content/site";

// Главная. В HTML лежат все три первых экрана; видимый выбирает CSS по
// атрибуту data-home на <html> — см. HomeVariantScript и HomeVariantSync.
// Всё, что ниже первого экрана, общее для трёх вариантов (§3.1 хендоффа).
export default function HomePage() {
  return (
    <>
      {/* Suspense обязателен: HomeVariantSync читает ?home= через
          useSearchParams, а при статическом экспорте сервер query не знает. */}
      <Suspense fallback={null}>
        <HomeVariantSync />
      </Suspense>

      {/* H1 страницы. У варианта A общего заголовка нет — блоки названы
          «Часы» и «Украшения», — поэтому H1 скрыт визуально и адресован
          поиску и экранному диктору. У вариантов B и C заголовок свой. */}
      {HOME_VARIANT === "a" && <h1 className="sr-only">{home.srTitle}</h1>}

      <div data-home-variant="a">
        <HomeVariantA />
      </div>
      <div data-home-variant="b">
        <HomeVariantB />
      </div>
      <div data-home-variant="c">
        <HomeVariantC />
      </div>

      <TrustBlock />
      <WhyInStore />
    </>
  );
}
