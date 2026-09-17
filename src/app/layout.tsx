import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyCta } from "@/components/StickyCta";
import { HomeVariantScript } from "@/components/home/HomeVariantScript";
import { site } from "@/lib/content/site";

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
    default: `${site.name} — швейцарские часы и украшения с бриллиантами в Оренбурге`,
    template: `%s · ${site.name}`,
  },
  description:
    "Салон «Золотая середина», Оренбург, ул. Советская, 31. Швейцарские часы 13 марок и украшения с бриллиантами. Примерка и консультация в салоне.",
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
      </head>
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="fade-up flex-1">{children}</main>
        <SiteFooter />
        <StickyCta />
      </body>
    </html>
  );
}
