import { home, site } from "@/lib/content/site";

// Блок доверия из трёх фактов. Общий для всех трёх вариантов главной (§3.1):
// всё, что ниже первого экрана, не дублируется.
export function TrustBlock() {
  return (
    <div className="pad-x pad-y grid-auto-dense gap-[32px_40px] border-b border-line">
      {home.trust.map((f) => (
        <div key={f.title}>
          <div className="fact-num">
            {f.title}
            {"titleSuffix" in f && f.titleSuffix ? (
              <span className="text-[18px] text-muted"> {f.titleSuffix}</span>
            ) : null}
          </div>
          <div className="mt-[8px] text-[14px] leading-[1.6] text-muted">{f.text}</div>
          {"social" in f && f.social ? (
            <div className="mt-[14px] flex flex-wrap gap-[8px]">
              <a
                href={site.social.telegram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[40px] items-center gap-[8px] rounded-[3px] border border-line2 px-[20px] py-[9px] text-[12px] text-ink"
              >
                <span className="h-[8px] w-[8px] rounded-full bg-ink" />
                Telegram
              </a>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[40px] items-center gap-[8px] rounded-[3px] border border-line2 px-[20px] py-[9px] text-[12px] text-ink"
              >
                <span className="h-[8px] w-[8px] rounded-full border border-ink" />
                Instagram
              </a>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default TrustBlock;
