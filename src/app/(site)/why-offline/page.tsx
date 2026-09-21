import type { Metadata } from "next";
import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";
import { site, why } from "@/lib/content/site";
import { cityTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: cityTitle(why.seoTitle),
  description: why.seoDescription,
};

// «Почему в салоне» — страница, куда ведут «Почему это важно →» и «Что не
// видно на экране» с главной (§4 хендоффа). Пары сравнений: два фото рядом
// и абзац. Фотографий ещё нет, поэтому в слотах — подпись, что снять:
// цифры в подписях и есть ТЗ на кадр.
export default function WhyOfflinePage() {
  return (
    <>
      <div className="pad-x pad-y border-b border-line">
        <div className="eyebrow mb-[12px] text-muted">{why.eyebrow}</div>
        <h1 className="h1-hero max-w-[900px]">{why.title}</h1>
        <p className="mt-[18px] max-w-[560px] text-[15px] leading-[1.65] text-muted">{why.lead}</p>
      </div>

      {why.sections.map((s) => {
        const warm = s.tone === "warm";
        return (
          <section key={s.eyebrow} className={`pad-x pad-y ${warm ? "bg-warm" : "bg-cool"}`}>
            <div className="eyebrow text-muted">{s.eyebrow}</div>
            <h2 className="h2-sec mt-[10px] max-w-[640px]">{s.title}</h2>

            {s.pairs.map((p) => (
              <div key={p.id} className="mt-[32px]">
                <div className="grid-auto gap-[8px] [--col-min:240px]">
                  {[p.a, p.b].map((caption) => (
                    <figure key={caption}>
                      <div className={`aspect-4/3 ${warm ? "bg-warm2" : "bg-cool2"}`}>
                        <ImageSlot photo={`Фото: ${caption}`} tone={warm ? "warm" : "cool"} />
                      </div>
                      <figcaption className="mt-[8px] font-mono text-[11px] text-muted">{caption}</figcaption>
                    </figure>
                  ))}
                </div>
                <p className="mt-[14px] max-w-[560px] text-[14px] leading-[1.65]">{p.text}</p>
              </div>
            ))}
          </section>
        );
      })}

      <div className="pad-x pad-y flex flex-wrap items-center justify-between gap-[24px]">
        <p className="h2-sec max-w-[560px]">{why.closing}</p>
        <Link href={site.cta.href} data-page-cta className="btn-primary">
          {site.cta.label}
        </Link>
      </div>
    </>
  );
}
