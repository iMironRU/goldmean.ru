import { Suspense } from "react";
import { HomeVariantA } from "@/components/home/HomeVariantA";
import { HomeVariantB } from "@/components/home/HomeVariantB";
import { HomeVariantC } from "@/components/home/HomeVariantC";
import { HomeVariantSync } from "@/components/home/HomeVariantSync";
import { TrustBlock } from "@/components/home/TrustBlock";
import { WhyInStore } from "@/components/home/WhyInStore";

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
