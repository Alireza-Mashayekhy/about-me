'use client';

import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { ProjectCover } from '@/components/portfolio/project-cover';
import { projects } from '@/data/portfolio';

const ALL = 'همه';

export function WorkGallery() {
  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(projects.map((p) => p.categoryEn)))],
    [],
  );
  const [filter, setFilter] = useState<string>(ALL);
  const visible = filter === ALL ? projects : projects.filter((p) => p.categoryEn === filter);

  return (
    <div>
      {/* فیلتر دسته‌بندی */}
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="فیلتر پروژه‌ها بر اساس دسته"
      >
        {categories.map((cat) => {
          const active = filter === cat;
          const label =
            cat === ALL ? ALL : (projects.find((p) => p.categoryEn === cat)?.categoryFa ?? cat);
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-[#C7FF4A] ${
                active
                  ? 'border-[#C7FF4A] bg-[#C7FF4A] text-[#07080B]'
                  : 'border-white/12 text-[#a7adb8] hover:border-white/30 hover:text-[#F1F0EB]'
              }`}
            >
              {label}
            </button>
          );
        })}
        <span className="ms-auto text-xs text-[#777D88]" aria-live="polite">
          {visible.length.toLocaleString('fa-IR')} پروژه
        </span>
      </div>

      {/* شبکهٔ پروژه‌ها */}
      <ul className="mt-8 grid gap-5 sm:grid-cols-2">
        {visible.map((project, i) => (
          <li key={project.slug} className="orbit-rise" style={{ animationDelay: `${i * 70}ms` }}>
            <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#111319] transition hover:border-[#C7FF4A]/45">
              <Link
                href={`/work/${project.slug}`}
                className="block focus-visible:outline-2 focus-visible:outline-[#C7FF4A]"
                aria-label={`جزئیات پروژه ${project.titleFa}`}
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <div className="h-full w-full transition duration-500 group-hover:scale-[1.03]">
                    <ProjectCover project={project} />
                  </div>
                </div>
              </Link>

              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[10px] tracking-[0.25em] text-[#777D88]" dir="ltr">
                    {project.categoryEn}
                  </p>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 font-mono text-[11px] text-[#a7adb8] transition hover:text-[#C7FF4A] focus-visible:outline-2 focus-visible:outline-[#C7FF4A]"
                    dir="ltr"
                    aria-label={`مشاهدهٔ وب‌سایت ${project.titleFa} در تب جدید`}
                  >
                    {project.domain}
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </div>

                <h2 className="mt-3 text-xl font-extrabold">
                  <Link
                    href={`/work/${project.slug}`}
                    className="transition group-hover:text-[#C7FF4A] focus-visible:outline-2 focus-visible:outline-[#C7FF4A]"
                  >
                    {project.titleFa}
                  </Link>
                </h2>
                <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-7 text-[#a7adb8]">
                  {project.summaryFa ??
                    'توضیحات این پروژه در حال تکمیل است؛ خودِ وب‌سایت منتشرشده را ببین.'}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  {project.tech.length > 0 ? (
                    <ul className="flex flex-wrap gap-1.5" dir="ltr">
                      {project.tech.map((t) => (
                        <li
                          key={t}
                          className="rounded-full border border-white/12 px-2.5 py-1 font-mono text-[10px]"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span />
                  )}
                  <Link
                    href={`/work/${project.slug}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#C7FF4A] hover:underline focus-visible:outline-2 focus-visible:outline-[#C7FF4A]"
                  >
                    جزئیات
                    <ArrowLeft className="size-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {visible.length === 0 && (
        <p className="mt-10 rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-[#777D88]">
          در این دسته پروژه‌ای نیست.
        </p>
      )}
    </div>
  );
}
