import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";
import { home } from "@/lib/content/site";

// «Почему в салоне» — крупная цитата, фото и переход на /why-offline.
// Общий блок для всех трёх вариантов главной.
export function WhyInStore() {
  const v = home.why;

  return (
    <div className="pad-x pad-y grid-auto items-center gap-[40px] [--col-min:280px]">
      <div>
        <div className="eyebrow mb-[14px] text-muted">{v.eyebrow}</div>
        <div className="h2-sec">{v.title}</div>
        <Link href="/why-offline" className="link-action mt-[20px]">
          {v.action}
        </Link>
      </div>
      <div className="aspect-4/3 bg-warm2">
        <ImageSlot photo={v.photo} src={v.src} tone="warm" />
      </div>
    </div>
  );
}

export default WhyInStore;
