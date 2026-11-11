import type { Metadata } from "next";
// Шрифты — self-hosted через @fontsource (те же файлы woff2, что качал
// next/font/google, с теми же unicode-range). next/font/google ломал сборку
// Turbopack на флейковом ответе Google Fonts (vercel/next.js#99114): Google
// иногда отдаёт URL без расширения, и Turbopack падает с
// «next/font/google queries have exactly one entry». Сетевой зависимости на
// сборке больше нет; семейства и начертания — те же.
import "@fontsource/manrope/300.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/600-italic.css";
import "./globals.css";
import { HomeVariantScript } from "@/components/home/HomeVariantScript";
import { watches } from "@/lib/content/catalog";
import { site } from "@/lib/content/site";
import { METRIKA_COUNTER_ID, METRIKA_INLINE_SCRIPT } from "@/lib/metrika";

// Корневой layout — только документ, шрифты и метаданные.
//
// Шапка, подвал и sticky-CTA живут в layout группы (site): страница выбора
// вариантов /preview — инструмент показа, а не страница сайта, и обвязка
// сайта ей не нужна.

export const metadata: Metadata = {
  metadataBase: new URL("https://goldmean.ru"),
  title: {
    default: `Часы и украшения с бриллиантами в Оренбурге · ${site.name}`,
    template: `%s · ${site.name}`,
  },
  // Число марок — из каталога: в тексте оно устаревало (было «13» при 14).
  description:
    `Швейцарские часы ${watches.brands.length} марок и украшения с бриллиантами. Оренбург, ул. Советская, 31. Примерка и консультация в салоне, официальный дилер.`,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: data-home на <html> ставит инлайн-скрипт до
    // гидратации (см. HomeVariantScript). Атрибута нет в серверном HTML, и без
    // подавления React ругается на несовпадение при каждой загрузке главной.
    <html lang="ru" suppressHydrationWarning>
      <head>
        <HomeVariantScript />
        {/* Яндекс.Метрика */}
        <script dangerouslySetInnerHTML={{ __html: METRIKA_INLINE_SCRIPT }} />
      </head>
      <body>
        {children}
        <noscript>
          <div>
            <img
              src={`https://mc.yandex.ru/watch/${METRIKA_COUNTER_ID}`}
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}
