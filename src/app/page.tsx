import { HomeVariantA } from "@/components/home/HomeVariantA";
import { HomeVariantB } from "@/components/home/HomeVariantB";
import { HomeVariantC } from "@/components/home/HomeVariantC";
import { TrustBlock } from "@/components/home/TrustBlock";
import { WhyInStore } from "@/components/home/WhyInStore";

// Главная. В HTML лежат все три первых экрана; видимый выбирает CSS по
// атрибуту data-home на <html> — см. HomeVariantScript и globals.css.
// Всё, что ниже первого экрана, общее для трёх вариантов (§3.1 хендоффа).
export default function HomePage() {
  return (
    <>
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
