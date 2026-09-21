import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
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

// Заголовки. Кириллица у Cormorant Garamond есть.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

// Текст и интерфейс. В токенах указан Figtree, но у него в Google Fonts нет
// кириллицы — весь русский текст уходил бы в системный фолбэк и рисовался на
// каждой машине своим шрифтом. Взяли Manrope: тот же геометрический гротеск,
// кириллица есть, те же начертания 300/400/500/600.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

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
    <html
      lang="ru"
      className={`${cormorant.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
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
