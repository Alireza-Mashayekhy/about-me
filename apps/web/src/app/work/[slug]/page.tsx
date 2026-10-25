import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CircleCheck,
  GitBranch,
  Hammer,
  Target,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ProjectCover } from '@/components/portfolio/project-cover';
import { SectionShell } from '@/components/portfolio/section-shell';
import { getProject, nextProject, projects } from '@/data/portfolio';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

// اسلاگ خارج از فهرست داده‌ها = ۴۰۴ واقعی (نه Soft-404)
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: 'پروژه یافت نشد' };
  return {
    title: project.titleFa,
    description: project.summaryFa ?? `پروژهٔ ${project.titleFa} — ${project.domain}`,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const next = nextProject(slug);
  const hasMeta = Boolean(project.roleFa || project.year || project.tech.length);

  return (
    <SectionShell sectionId="work">
      <Link
        href="/work"
        className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-[#a7adb8] transition hover:text-[#C7FF4A] focus-visible:outline-2 focus-visible:outline-[#C7FF4A]"
      >
        <ArrowRight className="size-4" />
        همهٔ پروژه‌ها
      </Link>

      {/* سربرگ پروژه */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.3em] text-[#C7FF4A]" dir="ltr">
            {project.categoryEn}
          </p>
          <h2 className="mt-3 text-4xl font-black sm:text-5xl">{project.titleFa}</h2>
          <p className="mt-2 font-mono text-sm text-[#777D88]" dir="ltr">
            {project.titleEn} — {project.domain}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full bg-[#C7FF4A] px-6 py-3 text-sm font-bold text-[#07080B] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C7FF4A]"
          >
            مشاهدهٔ وب‌سایت
            <ArrowUpRight className="size-4" />
          </a>
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold transition hover:border-[#C7FF4A]/60 hover:text-[#C7FF4A] focus-visible:outline-2 focus-visible:outline-[#C7FF4A]"
            >
              <GitBranch className="size-4" />
              مخزن عمومی
            </a>
          )}
        </div>
      </div>

      {/* پیش‌نمایش */}
      <figure className="mt-10 overflow-hidden rounded-2xl border border-white/10">
        <div className="aspect-[16/10]">
          <ProjectCover project={project} large />
        </div>
        <figcaption className="border-t border-white/8 bg-[#111319] px-5 py-3 text-xs text-[#777D88]">
          کاور رویه‌ای پروژه — برای دیدن خودِ محصول،{' '}
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="font-mono font-semibold text-[#C7FF4A] hover:underline"
            dir="ltr"
          >
            {project.domain}
          </a>{' '}
          را باز کن.
        </figcaption>
      </figure>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-12">
          {/* معرفی */}
          <section aria-labelledby="p-intro">
            <h3 id="p-intro" className="text-lg font-extrabold">
              معرفی پروژه
            </h3>
            <p className="mt-3 leading-9 text-[#a7adb8]">
              {project.summaryFa ??
                'توضیحات تکمیلی این پروژه در حال آماده‌سازی است. در همین حین، نسخهٔ منتشرشدهٔ وب‌سایت را می‌توانی مستقیم ببینی و اگر سؤالی دربارهٔ نقش یا جزئیات فنی آن داشتی، از صفحهٔ ارتباط بپرسی.'}
            </p>
          </section>

          {/* مسئله و هدف */}
          <section aria-labelledby="p-problem">
            <h3 id="p-problem" className="flex items-center gap-2 text-lg font-extrabold">
              <Target className="size-5 text-[#C7FF4A]" />
              مسئله و هدف
            </h3>
            <p className="mt-3 leading-9 text-[#a7adb8]">
              {project.problemFa ??
                'شرح دقیق مسئله و اهداف این پروژه در حال تکمیل است تا بدون اغراق و فقط بر اساس واقعیت منتشر شود.'}
            </p>
          </section>

          {/* قابلیت‌ها */}
          {project.featuresFa.length > 0 && (
            <section aria-labelledby="p-features">
              <h3 id="p-features" className="flex items-center gap-2 text-lg font-extrabold">
                <CircleCheck className="size-5 text-[#C7FF4A]" />
                قابلیت‌های اصلی
              </h3>
              <ul className="mt-4 space-y-2.5">
                {project.featuresFa.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 rounded-xl border border-white/8 bg-[#111319] px-4 py-3 text-sm leading-7"
                  >
                    <span
                      aria-hidden
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-[#C7FF4A]"
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* تصمیمات فنی */}
          <section aria-labelledby="p-decisions">
            <h3 id="p-decisions" className="flex items-center gap-2 text-lg font-extrabold">
              <Hammer className="size-5 text-[#C7FF4A]" />
              تصمیمات فنی
            </h3>
            {project.decisionsFa.length > 0 ? (
              <ul className="mt-4 space-y-2.5">
                {project.decisionsFa.map((d) => (
                  <li
                    key={d}
                    className="rounded-xl border border-white/8 bg-[#111319] px-4 py-3 text-sm leading-7"
                  >
                    {d}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 leading-9 text-[#a7adb8]">
                یادداشت‌های فنی این پروژه (معماری، انتخاب فناوری و چالش‌های پیاده‌سازی) در حال تکمیل
                است.
              </p>
            )}
          </section>
        </div>

        {/* متای پروژه */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#111319] p-6">
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#777D88]" dir="ltr">
              PROJECT DATA
            </p>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-white/6 pb-3">
                <dt className="text-[#777D88]">دسته</dt>
                <dd className="font-semibold">{project.categoryFa}</dd>
              </div>
              {project.roleFa && (
                <div className="flex items-center justify-between gap-4 border-b border-white/6 pb-3">
                  <dt className="text-[#777D88]">نقش من</dt>
                  <dd className="font-semibold">{project.roleFa}</dd>
                </div>
              )}
              {project.year && (
                <div className="flex items-center justify-between gap-4 border-b border-white/6 pb-3">
                  <dt className="text-[#777D88]">سال</dt>
                  <dd className="font-semibold">{project.year}</dd>
                </div>
              )}
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[#777D88]">وضعیت</dt>
                <dd className="font-semibold text-[#C7FF4A]">منتشرشده و آنلاین</dd>
              </div>
            </dl>

            {project.tech.length > 0 && (
              <>
                <p className="mt-6 font-mono text-[10px] tracking-[0.3em] text-[#777D88]" dir="ltr">
                  CONFIRMED STACK
                </p>
                <ul className="mt-3 flex flex-wrap gap-2" dir="ltr">
                  {project.tech.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-white/12 px-3 py-1.5 font-mono text-xs"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {!hasMeta && (
              <p className="mt-5 text-xs leading-6 text-[#777D88]">
                فناوری‌ها و نقش دقیق فقط وقتی اینجا درج می‌شود که قابل تأیید باشد.
              </p>
            )}
          </div>
        </aside>
      </div>

      {/* پروژهٔ بعدی */}
      <Link
        href={`/work/${next.slug}`}
        className="group mt-16 flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-white/10 bg-[#111319] p-6 transition hover:border-[#C7FF4A]/50 focus-visible:outline-2 focus-visible:outline-[#C7FF4A] sm:p-8"
      >
        <span>
          <span className="font-mono text-[10px] tracking-[0.3em] text-[#777D88]" dir="ltr">
            NEXT PROJECT
          </span>
          <span className="mt-2 block text-2xl font-black group-hover:text-[#C7FF4A]">
            {next.titleFa}
          </span>
          <span className="mt-1 block font-mono text-xs text-[#777D88]" dir="ltr">
            {next.domain}
          </span>
        </span>
        <ArrowLeft className="size-8 shrink-0 text-[#C7FF4A] transition group-hover:-translate-x-1.5" />
      </Link>
    </SectionShell>
  );
}
