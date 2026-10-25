export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#07080B] text-[#F1F0EB]">
      <span className="orbit-loader-ring" aria-hidden />
      <p className="text-xs text-[#777D88]">در حال بارگذاری…</p>
    </div>
  );
}
