"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";

// Живая миниатюра варианта главной.
//
// Внутри — настоящая страница в iframe, уменьшенная до ширины колонки. Не
// скриншоты: они устареют при первой же правке макета, и заказчику показали бы
// вчерашний сайт.
const FRAME_W = 1280;
const FRAME_H = 900;

export function VariantThumb({ variant }: { variant: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  // Масштаб считается от фактической ширины колонки: сетка на auto-fit, и
  // колонок может быть три, две или одна.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / FRAME_W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={box}
      className="relative w-full overflow-hidden border border-line2 bg-cool2"
      style={{ height: scale ? FRAME_H * scale : undefined, aspectRatio: scale ? undefined : `${FRAME_W} / ${FRAME_H}` }}
    >
      {scale > 0 && (
        <iframe
          // basePath в src не подставляется сам — только в next/link и
          // next/image. Без asset() миниатюра на Pages откроет 404.
          src={asset(`/?home=${variant}`)}
          title={`Вариант ${variant.toUpperCase()}`}
          loading="lazy"
          tabIndex={-1}
          aria-hidden
          // Клики уходят ссылке-оверлею на карточке: миниатюра открывает
          // вариант целиком, а не ходит по сайту внутри рамки.
          className="pointer-events-none absolute left-0 top-0 border-0"
          style={{
            width: FRAME_W,
            height: FRAME_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        />
      )}
    </div>
  );
}

export default VariantThumb;
