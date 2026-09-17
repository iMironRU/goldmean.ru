// Блок гарантии подлинности (§6 хендоффа). Рамка акцентом, круглая галочка,
// заголовок капителью. Текст разный для часов и украшений — приходит извне.
export function GuaranteeBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex items-start gap-[14px] rounded-[3px] border border-accent px-[20px] py-[18px]">
      <span className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full border border-accent text-[12px] text-accent">
        ✓
      </span>
      <div>
        <div className="text-[12px] font-medium uppercase tracking-[.12em] text-accent">{title}</div>
        <div className="mt-[6px] text-[13px] leading-[1.6] text-muted">{text}</div>
      </div>
    </div>
  );
}

export default GuaranteeBlock;
