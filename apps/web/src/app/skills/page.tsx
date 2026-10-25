import type { Metadata } from 'next';
import Link from 'next/link';

import { SectionShell } from '@/components/portfolio/section-shell';
import { skillGroups } from '@/data/portfolio';

export const metadata: Metadata = {
  title: 'مهارت‌ها',
  description:
    'مهارت‌های علیرضا مشایخی در فرانت‌اند، بک‌اند، مدیریت وضعیت و داده، سئو فنی و ابزارهای توسعهٔ وب.',
};

export default function SkillsPage() {
  return (
    <SectionShell sectionId="skills">
      <p className="max-w-2xl leading-9 text-[#a7adb8]">
        این فهرست، ابزارهایی است که واقعاً با آن‌ها محصول ساخته‌ام — بدون درصد تسلط و نوار پیشرفت
        تزئینی. اگر دربارهٔ عمق تجربه‌ام با هر کدام سؤالی داری، در{' '}
        <Link href="/contact" className="font-semibold text-[#C7FF4A] hover:underline">
          صفحهٔ ارتباط
        </Link>{' '}
        بپرس و نمونه‌اش را در{' '}
        <Link href="/work" className="font-semibold text-[#C7FF4A] hover:underline">
          پروژه‌ها
        </Link>{' '}
        ببین.
      </p>

      <div className="mt-12 space-y-14">
        {skillGroups.map((group, gi) => (
          <section key={group.id} aria-labelledby={`skill-${group.id}`}>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-white/10 pb-4">
              <span className="font-mono text-xs text-[#C7FF4A]" dir="ltr">
                {String(gi + 1).padStart(2, '0')}
              </span>
              <h2 id={`skill-${group.id}`} className="text-2xl font-extrabold">
                {group.titleFa}
              </h2>
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#777D88]" dir="ltr">
                {group.titleEn}
              </span>
              <span className="ms-auto text-xs text-[#777D88]">
                {group.items.length.toLocaleString('fa-IR')} مهارت
              </span>
            </div>

            <ul className="mt-6 flex flex-wrap gap-2.5">
              {group.items.map((item) => {
                const isLatin = !/[^\x20-\x7E]/.test(item);
                return (
                  <li
                    key={item}
                    dir={isLatin ? 'ltr' : 'rtl'}
                    className="rounded-full border border-white/12 bg-[#111319] px-4 py-2 text-sm transition hover:border-[#C7FF4A]/50 hover:text-[#C7FF4A]"
                  >
                    {item}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </SectionShell>
  );
}
