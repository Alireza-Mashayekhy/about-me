import type { Metadata } from 'next';
import Link from 'next/link';

import { SectionShell } from '@/components/portfolio/section-shell';
import { expertiseAreas, profile, projects, skillGroups } from '@/data/portfolio';

export const metadata: Metadata = {
  title: 'درباره من',
  description: profile.bioFa,
};

const coreStack = ['React.js', 'Next.js', 'Vue.js', 'TypeScript', 'Node.js', 'NestJS'];

export default function AboutPage() {
  return (
    <SectionShell sectionId="about">
      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="text-xl leading-10 font-medium text-[#F1F0EB] sm:text-2xl sm:leading-12">
            {profile.bioFa}
          </p>

          <div className="mt-10 space-y-6 leading-9 text-[#a7adb8]">
            <p>
              در حدود {profile.experienceFa.replace('حدود ', '')} گذشته، در تمام لایه‌های ساخت محصول
              وب کار کرده‌ام: از رابط کاربری و تجربهٔ تعاملی در فرانت‌اند، تا طراحی API و منطق تجاری
              در بک‌اند. همین نگاه سرتاسری باعث می‌شود تصمیم‌های هر لایه با دانستن اثرش روی بقیهٔ
              سیستم گرفته شود.
            </p>
            <p>
              برای من یک محصول خوب فقط «کارکردن» نیست؛ باید سریع باشد، در جست‌وجو پیدا شود، روی
              موبایل به‌اندازهٔ دسکتاپ خوب باشد و شش ماه بعد هم بشود بدون ترس توسعه‌اش داد. سئو فنی
              و بهینه‌سازی برای همین از روز اول جزئی از کار من است، نه مرحله‌ای جدا در انتهای پروژه.
            </p>
            <p>
              این وب‌سایت خودش یک نمونه از همین رویکرد است: یک تجربهٔ سه‌بعدی تعاملی که روی معماری
              واقعی Next.js و TypeScript سوار شده و هر بخشش یک صفحهٔ واقعی و قابل دسترس است — نه فقط
              یک نمایش بصری.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/work"
              className="rounded-full bg-[#C7FF4A] px-6 py-3 text-sm font-bold text-[#07080B] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C7FF4A]"
            >
              دیدن پروژه‌ها
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold transition hover:border-[#C7FF4A]/60 hover:text-[#C7FF4A] focus-visible:outline-2 focus-visible:outline-[#C7FF4A]"
            >
              شروع گفت‌وگو
            </Link>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#111319] p-6">
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#777D88]" dir="ltr">
              PROFILE
            </p>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-white/6 pb-3">
                <dt className="text-[#777D88]">نام</dt>
                <dd className="font-semibold">{profile.nameFa}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-white/6 pb-3">
                <dt className="text-[#777D88]">عنوان</dt>
                <dd className="font-semibold">{profile.roleFa}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-white/6 pb-3">
                <dt className="text-[#777D88]">تجربه</dt>
                <dd className="font-semibold">{profile.experienceFa}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[#777D88]">پروژهٔ منتشرشده در این پورتفولیو</dt>
                <dd className="font-semibold">{projects.length.toLocaleString('fa-IR')} پروژه</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111319] p-6">
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#777D88]" dir="ltr">
              CORE STACK
            </p>
            <ul className="mt-4 flex flex-wrap gap-2" dir="ltr">
              {coreStack.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-white/12 px-3 py-1.5 font-mono text-xs"
                >
                  {t}
                </li>
              ))}
            </ul>
            <Link
              href="/skills"
              className="mt-5 inline-block text-xs font-semibold text-[#C7FF4A] hover:underline focus-visible:outline-2 focus-visible:outline-[#C7FF4A]"
            >
              همهٔ مهارت‌ها (
              {skillGroups.reduce((a, g) => a + g.items.length, 0).toLocaleString('fa-IR')} مورد در{' '}
              {skillGroups.length.toLocaleString('fa-IR')} دسته) ←
            </Link>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111319] p-6">
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#777D88]" dir="ltr">
              FOCUS AREAS
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {expertiseAreas.map((a) => (
                <li key={a.id}>
                  <Link
                    href="/expertise"
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 transition hover:bg-white/5 hover:text-[#C7FF4A] focus-visible:outline-2 focus-visible:outline-[#C7FF4A]"
                  >
                    {a.titleFa}
                    <span aria-hidden>←</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </SectionShell>
  );
}
