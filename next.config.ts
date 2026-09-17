import type { NextConfig } from "next";
import { execSync } from "node:child_process";

// Идентификатор сборки. По умолчанию Next генерирует его случайным, и он зашит
// в пути к статике на каждой странице — при любой пересборке меняются все файлы
// сайта. Считаем его от последнего коммита, менявшего КОД: правка контента
// (content/*.json) идентификатор не трогает, поэтому на хостинг уходят только
// реально изменившиеся страницы.
function codeBuildId(): string | null {
  try {
    const sha = execSync(
      "git log -1 --format=%H -- src public next.config.ts package.json package-lock.json",
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
    return sha ? sha.slice(0, 12) : null;
  } catch {
    return null; // не git-каталог — пусть Next решает сам
  }
}

// basePath задаётся в GitHub Actions (NEXT_PUBLIC_BASE_PATH=/goldmean.ru),
// локально пусто — сайт работает по http://localhost:3000.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // Статический экспорт в out/ — то, что раздаёт GitHub Pages и хостинг.
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  generateBuildId: async () => codeBuildId(),
  // На статике нет сервера оптимизации картинок.
  images: { unoptimized: true },
  // Каждый маршрут выгружается как каталог с index.html.
  trailingSlash: true,
};

export default nextConfig;
