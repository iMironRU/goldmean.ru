// Плейсхолдер под фотографию. Замена прототипному <image-slot> (design-ref).
//
// Съёмки ещё нет (§12 п.5 хендоффа), а подпись к каждому слоту — это ТЗ на
// кадр: что снять, в каком свете и ракурсе. Поэтому подпись выводится прямо
// в плейсхолдере: заказчик на показе видит, какие фотографии от него нужны.
//
// Когда фотографии появятся, слот принимает src и рисует картинку — вызовы
// в страницах менять не придётся.

type Props = {
  /** Описание нужного кадра. Показывается, пока фотографии нет. */
  photo: string;
  /** Путь к фотографии в public/. Появится после съёмки. */
  src?: string;
  /** Подложка слота: холодная (часы) или тёплая (украшения). */
  tone?: "cool" | "warm";
  className?: string;
};

export function ImageSlot({ photo, src, tone = "cool", className = "" }: Props) {
  const bg = tone === "warm" ? "var(--warm2)" : "var(--cool2)";

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={photo}
        className={`h-full w-full object-cover ${className}`}
        style={{ background: bg }}
      />
    );
  }

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      style={{ background: bg }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[10px] rounded-[3px] border-[1.5px] border-dashed"
        style={{ borderColor: "color-mix(in srgb, var(--muted) 35%, transparent)" }}
      />
      <span
        className="relative max-w-[80%] text-center text-[12px] leading-[1.5]"
        style={{ color: "color-mix(in srgb, var(--muted) 80%, transparent)" }}
      >
        {photo}
      </span>
    </div>
  );
}

export default ImageSlot;
