"use client";

import { useEffect, useRef, useState } from "react";
import { ImageSlot } from "@/components/ImageSlot";
import { asset } from "@/lib/asset";

// Фото-кнопка первого экрана (вариант A): вместо снимка — зацикленный ролик
// с тем же медленным приближением, что делал CSS (решение заказчика).
//
// Видео, а не GIF: тот же кадр в GIF весит 3,7 МБ против 240 КБ, у GIF 256
// цветов на кадр — на белой ткани идут полосы, и остановить его нельзя.
//
// Ролик немой и без органов управления, поэтому сам по себе он играет во
// всех браузерах: автозапуск разрешён только беззвучному видео. playsInline
// обязателен — без него iPhone открывает видео на весь экран.
export function PhotoLoop({
  photo,
  src,
  video,
  tone,
}: {
  /** Описание кадра — оно же альтернативный текст. */
  photo: string;
  /** Снимок: постер ролика и запасной вариант. */
  src?: string;
  video?: string;
  tone?: "cool" | "warm";
}) {
  const ref = useRef<HTMLVideoElement>(null);
  // Пока не знаем настроек системы — показываем ролик: так же, как в
  // серверном HTML, иначе разметка на клиенте разошлась бы с ней.
  const [still, setStill] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setStill(mq.matches);
      if (mq.matches) ref.current?.pause();
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Ролика нет (или его ещё не сняли) — остаётся обычный слот под фото.
  if (!video || !src || still) return <ImageSlot photo={photo} src={src} tone={tone} />;

  return (
    <video
      ref={ref}
      src={asset(video)}
      poster={asset(src)}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={photo}
      className="h-full w-full object-cover"
    />
  );
}

export default PhotoLoop;
