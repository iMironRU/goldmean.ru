import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";
import { watches } from "@/lib/content/catalog";

// Врезка про часового мастера внизу каталога часов (§7 хендоффа).
export function MasterTeaser() {
  const t = watches.masterTeaser;

  return (
    <Link
      href="/master"
      className="pad-x pad-y grid-auto items-center gap-[40px] border-t border-line bg-cool text-ink [--col-min:300px]"
    >
      <div className="aspect-4/5 max-w-[420px] bg-cool2">
        <ImageSlot photo={t.photo} tone="cool" />
      </div>
      <div>
        <div className="eyebrow mb-[14px] text-muted">{t.eyebrow}</div>
        <div className="h2-sec">{t.title}</div>
        <p className="mt-[14px] max-w-[440px] text-[14px] leading-[1.6] text-muted">{t.text}</p>
        <span className="link-action mt-[20px]">{t.action}</span>
      </div>
    </Link>
  );
}

export default MasterTeaser;
