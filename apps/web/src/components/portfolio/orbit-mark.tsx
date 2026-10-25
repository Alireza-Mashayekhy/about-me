/**
 * نشان ORBIT — با CSS ساخته شده تا به گلیف خاصی از فونت وابسته نباشد:
 * یک حلقه (مدار) و یک نقطه (هسته) با یک ماهوارهٔ کوچک روی مدار.
 */
export function OrbitMark({ size = 36 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="relative inline-flex shrink-0 items-center justify-center rounded-full border border-white/15"
      style={{ width: size, height: size }}
    >
      <span
        className="rounded-full bg-[#C7FF4A]"
        style={{ width: size * 0.18, height: size * 0.18 }}
      />
      <span
        className="absolute rounded-full bg-[#F1F0EB]"
        style={{
          width: size * 0.11,
          height: size * 0.11,
          top: size * 0.1,
          insetInlineEnd: size * 0.12,
        }}
      />
    </span>
  );
}
