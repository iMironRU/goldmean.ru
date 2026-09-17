import { asset } from "@/lib/asset";

// Плейсхолдер под фотографию. Замена прототипному <image-slot> (design-ref).
//
// Съёмки ещё нет (§12 п.5 хендоффа), а подпись к каждому слоту — это ТЗ на
// кадр: что снять, в каком свете и ракурсе. Поэтому подпись выводится прямо
// в плейсхолдере: заказчик на показе видит, какие фотографии от него нужны.
//
// Как только у слота появляется src, он рисует картинку — вызовы в страницах
// менять не приходится. Так уже подставлены логотипы марок.

type Props = {
  /** Описание нужного кадра. Показывается, пока картинки нет. */
  photo: string;
  /** Путь к файлу в public/. */
  src?: string;
  /** Подложка слота: холодная (часы) или тёплая (украшения). */
  tone?: "cool" | "warm";
  /**
   * contain — для логотипов: вписать целиком, не обрезая и не подкрашивая
   * подложку. cover — для фотографий: заполнить слот.
   */
  fit?: "cover" | "contain";
  className?: string;
};

export function ImageSlot({
  photo,
  src,
  tone = "cool",
  fit = "cover",
  className = "",
}: Props) {
  const bg = tone === "warm" ? "var(--warm2)" : "var(--cool2)";

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        // basePath в обычный <img src> Next не подставляет — только в
        // next/image. Без asset() логотипы отдали бы 404 на Pages.
        src={src.startsWith("/") ? asset(src) : src}
        alt={photo}
        loading="lazy"
        className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} ${className}`}
        // Логотип лежит на собственном фоне плитки, подкрашивать его не надо.
        style={fit === "contain" ? undefined : { background: bg }}
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
