import { Suspense } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyCta } from "@/components/StickyCta";
import { PreviewBar } from "@/components/preview/PreviewBar";

// Обвязка сайта. Живёт в группе (site), чтобы /preview — страница выбора
// вариантов главной — рисовалась без шапки, подвала и sticky-CTA.
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      {/* Без fade-up. Класс анимирует transform, а элемент с такой анимацией
          становится содержащим блоком для position:fixed внутри — и любая
          фиксированная панель на любой странице ездила бы вместе с
          прокруткой. По §10 fadeUp нужен только экранам успеха, не странице
          целиком. */}
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <StickyCta />
      {/* Suspense обязателен: PreviewBar читает ?home= через useSearchParams,
          а при статическом экспорте сервер query не знает. */}
      <Suspense fallback={null}>
        <PreviewBar />
      </Suspense>
    </div>
  );
}
