import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { SectionShell } from '@/components/portfolio/section-shell';
import { expertiseAreas } from '@/data/portfolio';

export const metadata: Metadata = {
  title: 'توسعه محصول — حوزه‌های تخصصی',
  description:
    'حوزه‌های تخصصی علیرضا مشایخی: فرانت‌اند، بک‌اند و API، اپلیکیشن‌های فول‌استک، سئو فنی و استقرار محصولات وب.',
};

export default function ExpertisePage() {
  return (
    <SectionShell sectionId="expertise">
      <div className="grid gap-4 md:grid-cols-2">
        {expertiseAreas.map((area, i) => (
          <article
            key={area.id}
            className={`group rounded-2xl border border-white/10 bg-[#111319] p-6 transition hover:border-[#C7FF4A]/45 sm:p-8 ${
              i === 0 ? 'md:col-span-2' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#C7FF4A]" dir="ltr">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#777D88]" dir="ltr">
                {area.titleEn}
              </span>
            </div>
            <h2 className="mt-5 text-2xl font-extrabold">{area.titleFa}</h2>
            <p className="mt-3 leading-9 text-[#a7adb8]">{area.descriptionFa}</p>
            <ul className="mt-6 flex flex-wrap gap-2" dir="ltr">
              {area.related.map((r) => (
                <li
                  key={r}
                  className="rounded-full border border-white/12 px-3 py-1.5 font-mono text-xs text-[#c9cdd6]"
                >
                  {r}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#111319] p-6 sm:p-8">
        <div>
          <h2 className="text-lg font-extrabold">این حوزه‌ها در عمل چه خروجی‌ای داشته‌اند؟</h2>
          <p className="mt-1.5 text-sm text-[#a7adb8]">
            نمونه‌های واقعی و منتشرشده را در گالری پروژه‌ها ببین.
          </p>
        </div>
        <Link
          href="/work"
          className="flex items-center gap-2 rounded-full bg-[#C7FF4A] px-6 py-3 text-sm font-bold text-[#07080B] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C7FF4A]"
        >
          گالری پروژه‌ها
          <ArrowLeft className="size-4" />
        </Link>
      </div>
    </SectionShell>
  );
}
