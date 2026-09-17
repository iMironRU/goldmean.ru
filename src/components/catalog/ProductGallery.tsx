"use client";

import { useState } from "react";
import { ImageSlot } from "@/components/ImageSlot";

// Галерея фотографий товара.
//
// Миниатюры лежат ПОВЕРХ основного снимка, в левом нижнем углу — так же, как
// ярлыки характеристик на карточке каталога (§6). Под фотографией их не
// видно: на широком экране квадратный кадр занимает почти весь первый экран,
// и ряд превью оказывался за его нижней границей.
//
// У миниатюр есть рамка и светлая подложка: товарные снимки почти всегда на
// белом фоне, и без рамки превью на нём растворяются.
export function ProductGallery({
  photos,
  alt,
  tone = "cool",
}: {
  photos: string[];
  alt: string;
  tone?: "cool" | "warm";
}) {
  const [active, setActive] = useState(0);

  return (
    <div className={`relative aspect-square ${tone === "warm" ? "bg-warm2" : "bg-cool"}`}>
      <ImageSlot photo={alt} src={photos[active]} tone={tone} />

      {photos.length > 1 && (
        <div className="absolute bottom-[8px] left-[8px] flex flex-wrap gap-[6px]">
          {photos.slice(0, 5).map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ракурс ${i + 1}`}
              aria-pressed={i === active}
              className="h-[56px] w-[56px] overflow-hidden rounded-[3px] border bg-bg p-0 transition-colors desktop:h-[64px] desktop:w-[64px]"
              style={{
                borderColor: i === active ? "var(--ink)" : "var(--line2)",
                boxShadow: "0 6px 16px -8px rgba(28,27,25,.45)",
              }}
            >
              <ImageSlot photo={`${alt} — ракурс ${i + 1}`} src={src} tone={tone} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductGallery;
