import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";
import { home } from "@/lib/content/site";

// Вариант «a» — развилка. Два полноэкранных фото-блока без заголовка-лида:
// решение «часы или украшения» принимается сразу (§3.1).
export function HomeVariantA() {
  const v = home.a;

  return (
    <div className="grid-auto gap-px bg-line">
      <Link
        href="/watches"
        className="relative block h-[360px] bg-cool desktop:h-[620px]"
      >
        <div className="absolute inset-0">
          <ImageSlot photo={v.watches.photo} tone="cool" />
        </div>
        <div
          className="pad-x pointer-events-none absolute inset-x-0 bottom-0 py-[20px] desktop:py-[56px]"
          style={{
            background:
              "linear-gradient(to top, rgba(20,22,24,.55), rgba(20,22,24,0) 70%)",
          }}
        >
          <div className="eyebrow mb-[10px] text-[#f2efe9] opacity-85">
            {v.watches.eyebrow}
          </div>
          <div className="h1-hero text-[#faf9f7]" style={{ lineHeight: 1 }}>
            {v.watches.title}
          </div>
          <div className="mt-[16px] inline-block border-b border-[rgba(250,249,247,.6)] pb-[4px] text-[13px] tracking-[.06em] text-[#faf9f7]">
            {v.watches.action}
          </div>
        </div>
      </Link>

      <Link
        href="/jewelry"
        className="relative block h-[360px] bg-warm2 desktop:h-[620px]"
      >
        <div className="absolute inset-0">
          <ImageSlot photo={v.jewelry.photo} tone="warm" />
        </div>
        <div
          className="pad-x pointer-events-none absolute inset-x-0 bottom-0 py-[20px] desktop:py-[56px]"
          style={{
            background:
              "linear-gradient(to top, rgba(30,24,18,.55), rgba(30,24,18,0) 70%)",
          }}
        >
          <div className="eyebrow mb-[10px] text-[#f2efe9] opacity-85">
            {v.jewelry.eyebrow}
          </div>
          <div className="h1-hero text-[#faf9f7]" style={{ lineHeight: 1 }}>
            {v.jewelry.title}
            <br />
            <em className="font-normal">{v.jewelry.titleEm}</em>
          </div>
          <div className="mt-[16px] inline-block border-b border-[rgba(250,249,247,.6)] pb-[4px] text-[13px] tracking-[.06em] text-[#faf9f7]">
            {v.jewelry.action}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default HomeVariantA;
