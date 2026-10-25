import type { Metadata } from 'next';
import Link from 'next/link';

import { SectionShell } from '@/components/portfolio/section-shell';
import { approachSteps } from '@/data/portfolio';

export const metadata: Metadata = {
  title: 'روش کار من',
  description:
    'فرایند کاری علیرضا مشایخی: شناخت نیاز، طراحی ساختار، پیاده‌سازی، تست، بهینه‌سازی و نگهداری محصول وب.',
};

export default function ApproachPage() {
  return (
    <SectionShell sectionId="approach">
      <p className="max-w-2xl leading-9 text-[#a7adb8]">
        هر محصولی که می‌سازم از همین مسیر رد می‌شود. این فرایند برای من تشریفات نیست؛ راهی است برای
        اینکه خروجی نهایی هم برای کاربر خوب باشد، هم برای کسی که قرار است بعداً آن را توسعه بدهد —
        که خیلی وقت‌ها خودمم.
      </p>

      <ol className="relative mt-14 space-y-0">
        <span
          aria-hidden
          className="absolute top-2 bottom-2 w-px bg-gradient-to-b from-[#C7FF4A]/50 via-white/12 to-transparent ltr:left-[27px] rtl:right-[27px]"
        />
        {approachSteps.map((step) => (
          <li key={step.index} className="relative flex gap-5 pb-12 last:pb-0 sm:gap-8">
            <span className="z-10 flex size-14 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[#111319] font-mono text-sm font-bold text-[#C7FF4A]">
              {step.index}
            </span>
            <div className="min-w-0 pt-2">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h2 className="text-xl font-extrabold sm:text-2xl">{step.titleFa}</h2>
                <span className="font-mono text-[10px] tracking-[0.3em] text-[#777D88]" dir="ltr">
                  {step.titleEn}
                </span>
              </div>
              <p className="mt-3 max-w-2xl leading-9 text-[#a7adb8]">{step.descriptionFa}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-16 rounded-2xl border border-[#C7FF4A]/25 bg-[#C7FF4A]/5 p-6 sm:p-8">
        <h2 className="text-lg font-extrabold">پروژه‌ای در ذهن داری؟</h2>
        <p className="mt-2 max-w-xl leading-8 text-[#a7adb8]">
          از مرحلهٔ اول شروع کنیم: مسئله را با هم دقیق بفهمیم، بعد دربارهٔ راهکار تصمیم بگیریم.
        </p>
        <Link
          href="/contact"
          className="mt-5 inline-block rounded-full bg-[#C7FF4A] px-6 py-3 text-sm font-bold text-[#07080B] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C7FF4A]"
        >
          شروع از مرحلهٔ شناخت
        </Link>
      </div>
    </SectionShell>
  );
}
