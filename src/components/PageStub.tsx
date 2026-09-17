import Link from "next/link";
import routes from "../../content/routes.json";
import { site } from "@/lib/content/site";

// Заглушка невёрстанной страницы.
//
// В первый заход собраны каркас и три варианта главной (§13 п. 1–2). Чтобы
// на показе заказчику меню и переходы работали по-настоящему, остальные
// маршруты существуют и честно говорят, что на них будет, — вместо 404 или
// молчаливой пустой страницы.
//
// Заглушка удаляется вместе с появлением настоящей страницы.
export function PageStub({ route }: { route: keyof typeof routes }) {
  const page = routes[route];

  return (
    <div className="pad-x pad-y">
      <div className="eyebrow mb-[14px] text-accent">В разработке</div>
      <h1 className="h1-hero max-w-[820px]">{page.title}</h1>
      <p className="mt-[24px] max-w-[640px] text-[15px] leading-[1.65] text-muted">
        {page.lead}
      </p>

      <div className="mt-[40px] max-w-[640px] border-t border-line pt-[24px]">
        <div className="eyebrow mb-[16px] text-muted">Что будет на странице</div>
        <ul className="flex flex-col gap-[10px]">
          {page.planned.map((item) => (
            <li key={item} className="flex gap-[12px] text-[14px] leading-[1.6]">
              <span className="mt-[9px] h-px w-[16px] shrink-0 bg-line2" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-[40px] flex flex-wrap items-center gap-[12px]">
        <Link href="/" className="btn-primary">
          На главную
        </Link>
        <a href={site.phoneHref} className="text-[13px] text-muted">
          {site.phone} · {site.hours}
        </a>
      </div>
    </div>
  );
}

export default PageStub;
