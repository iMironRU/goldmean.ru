import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";
import { home } from "@/lib/content/site";

// Затемнение под белым текстом — отдельным слоем на всё фото, а не на блоке
// с текстом: так шкала считается от высоты снимка, а не от высоты текста.
// В прототипе было .55 → 0 на блоке с текстом, и на светлом кадре заголовок
// «Часы» терял контраст до 1,5:1. Значения подобраны под худший случай —
// белый снимок: заголовок (крупный) не ниже 3:1, подпись и ссылка (мелкие)
// не ниже 4,5:1. Текст поднимается до ~53 % высоты фото от низа (подпись над
// двухстрочным заголовком украшений на телефоне), поэтому .64 держится до
// 55 % и уходит в ноль к 85 %. У подписи снята прозрачность .85 из
// прототипа: с ней мелкий текст на светлом кадре не дотягивал до 4,5:1.
const SCRIM = (rgb: string) =>
  `linear-gradient(to top, rgba(${rgb},.72) 0%, rgba(${rgb},.64) 55%, rgba(${rgb},0) 85%)`;

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
        {/* Фото медленно приближается и уходит обратно — 28 секунд на цикл
            (класс .ken-burns в globals.css). Движение на самой картинке,
            обрезка — на обёртке. */}
        <div className="ken-burns absolute inset-0">
          <ImageSlot photo={v.watches.photo} src={v.watches.src} tone="cool" />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: SCRIM("20,22,24") }}
        />
        <div className="pad-x pointer-events-none absolute inset-x-0 bottom-0 py-[20px] desktop:py-[56px]">
          <div className="eyebrow mb-[10px] text-[#f2efe9]">
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
        <div className="ken-burns ken-burns-late absolute inset-0">
          <ImageSlot photo={v.jewelry.photo} src={v.jewelry.src} tone="warm" />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: SCRIM("30,24,18") }}
        />
        <div className="pad-x pointer-events-none absolute inset-x-0 bottom-0 py-[20px] desktop:py-[56px]">
          <div className="eyebrow mb-[10px] text-[#f2efe9]">
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
