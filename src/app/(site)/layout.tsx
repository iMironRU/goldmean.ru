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
      <main className="fade-up flex-1">{children}</main>
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
