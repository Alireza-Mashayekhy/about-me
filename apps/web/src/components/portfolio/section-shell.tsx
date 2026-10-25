'use client';

import { ArrowUpLeft, Globe } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { profile, type SectionId, sections } from '@/data/portfolio';

import { OrbitMark } from './orbit-mark';

interface SectionShellProps {
  sectionId: SectionId;
  children: React.ReactNode;
}

/**
 * پوستهٔ مشترک صفحات داخلی ORBIT:
 * هدر با ناوبری کامل + دکمهٔ بازگشت به گوی + تیتر سینمایی بخش.
 * بازگشت با `/?return` انجام می‌شود تا گوی با زاویهٔ قبلی و
 * انیمیشن عقب‌نشینی معکوس دوباره ظاهر شود. Escape هم همین کار را می‌کند.
 */
export function SectionShell({ sectionId, children }: SectionShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const section = sections.find((s) => s.id === sectionId)!;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // وقتی کاربر در حال تایپ در فرم است (مثلاً فرم تماس) Escape نباید او را از صفحه بیرون ببرد
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        target.blur();
        return;
      }
      router.push('/?return=1');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [router]);

  return (
    <div className="orbit-page-reveal min-h-dvh bg-[#07080B] text-[#F1F0EB]">
      {/* هدر */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#07080B]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3.5 sm:px-8">
          <Link
            href="/?return=1"
            className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-[#C7FF4A]"
            aria-label="بازگشت به گوی اصلی"
          >
            <OrbitMark size={32} />
            <span className="hidden text-sm font-bold sm:block">{profile.nameFa}</span>
            <span
              className="hidden font-mono text-[9px] tracking-[0.3em] text-[#777D88] lg:block"
              dir="ltr"
            >
              ORBIT
            </span>
          </Link>

          <nav aria-label="بخش‌های پورتفولیو" className="hidden items-center gap-1 md:flex">
            {sections.map((s) => {
              const active = pathname === s.href || pathname.startsWith(`${s.href}/`);
              return (
                <Link
                  key={s.id}
                  href={s.href}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-full px-3 py-1.5 text-xs transition focus-visible:outline-2 focus-visible:outline-[#C7FF4A] ${
                    active
                      ? 'bg-[#C7FF4A]/12 font-semibold text-[#C7FF4A]'
                      : 'text-[#a7adb8] hover:bg-white/5 hover:text-[#F1F0EB]'
                  }`}
                >
                  {s.labelFa}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/?return=1"
            className="flex items-center gap-2 rounded-full border border-[#C7FF4A]/40 bg-[#C7FF4A]/8 px-4 py-2 text-xs font-semibold text-[#C7FF4A] transition hover:bg-[#C7FF4A]/16 focus-visible:outline-2 focus-visible:outline-[#C7FF4A]"
          >
            <Globe className="size-3.5" />
            بازگشت به جهان من
            <ArrowUpLeft className="size-3.5" />
          </Link>
        </div>

        {/* ناوبری موبایل */}
        <nav
          aria-label="بخش‌های پورتفولیو"
          className="orbit-no-scrollbar flex gap-1 overflow-x-auto px-4 pb-3 md:hidden"
        >
          {sections.map((s) => {
            const active = pathname === s.href || pathname.startsWith(`${s.href}/`);
            return (
              <Link
                key={s.id}
                href={s.href}
                aria-current={active ? 'page' : undefined}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs ${
                  active ? 'border-[#C7FF4A]/60 text-[#C7FF4A]' : 'border-white/10 text-[#a7adb8]'
                }`}
              >
                {s.labelFa}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* تیتر بخش */}
      <div className="relative overflow-hidden">
        <p
          aria-hidden
          className="orbit-ghost-word pointer-events-none absolute -top-4 left-0 font-mono text-[19vw] leading-none font-black tracking-tight whitespace-nowrap"
          dir="ltr"
        >
          {section.labelEn}
        </p>
        <div className="orbit-rise relative mx-auto max-w-6xl px-5 pt-16 pb-10 sm:px-8 sm:pt-24">
          <p
            className="flex items-center gap-3 font-mono text-[11px] tracking-[0.35em] text-[#C7FF4A]"
            dir="ltr"
          >
            <span>{section.index}</span>
            <span className="h-px w-10 bg-[#C7FF4A]/50" />
            <span>{section.labelEn}</span>
          </p>
          <h1 className="mt-5 text-4xl font-black sm:text-6xl">{section.labelFa}</h1>
          <p className="mt-4 max-w-xl leading-8 text-[#a7adb8]">{section.teaserFa}</p>
        </div>
      </div>

      {/* محتوا */}
      <main
        className="orbit-rise mx-auto max-w-6xl px-5 pb-24 sm:px-8"
        style={{ animationDelay: '120ms' }}
      >
        {children}
      </main>

      {/* فوتر */}
      <footer className="border-t border-white/8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-xs text-[#777D88] sm:px-8">
          <p>
            {profile.nameFa} — {profile.roleFa}
          </p>
          <p className="font-mono text-[10px] tracking-[0.25em]" dir="ltr">
            ORBIT © {new Date().getFullYear()} — PRESS ESC TO RETURN
          </p>
          <Link
            href="/?return=1"
            className="flex items-center gap-1.5 font-semibold text-[#C7FF4A] hover:underline focus-visible:outline-2 focus-visible:outline-[#C7FF4A]"
          >
            بازگشت به جهان من
            <ArrowUpLeft className="size-3.5" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
