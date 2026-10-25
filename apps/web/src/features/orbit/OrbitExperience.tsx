'use client';

import { ArrowLeft, ChevronDown, MousePointerClick, Move3d, SkipForward } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { OrbitMark } from '@/components/portfolio/orbit-mark';
import { profile, sections } from '@/data/portfolio';

import {
  hasVisitedOrbit,
  loadSphereQuaternion,
  markOrbitVisited,
  orbitRuntime,
  useOrbitStore,
} from './store';

const OrbitCanvas = dynamic(() => import('./OrbitCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <p className="animate-pulse text-xs tracking-widest text-[#777D88]">LOADING ORBIT…</p>
    </div>
  ),
});

type Quat = { x: number; y: number; z: number; w: number };

function detectWebgl(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function OrbitExperience() {
  const router = useRouter();
  const phase = useOrbitStore((s) => s.phase);
  const hoveredId = useOrbitStore((s) => s.hoveredId);
  const targetId = useOrbitStore((s) => s.targetId);
  const webglOk = useOrbitStore((s) => s.webglOk);

  const [firstFrame, setFirstFrame] = useState(false);
  // پیکربندی arranque فقط روی کلاینت و یک‌بار محاسبه می‌شود (sessionStorage/matchMedia/WebGL)
  const [init, setInit] = useState<{ ready: boolean; initialQuat: Quat | null; lowPower: boolean }>(
    {
      ready: false,
      initialQuat: null,
      lowPower: false,
    },
  );
  const { ready, initialQuat, lowPower } = init;

  const wrapRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const interactive = phase === 'INTERACTIVE' || phase === 'ENTERING' || phase === 'RETURNING';
  const hoveredSection = useMemo(
    () => sections.find((s) => s.id === (targetId ?? hoveredId)) ?? null,
    [hoveredId, targetId],
  );

  /* --- راه‌اندازی اولیه: تشخیص بازگشت، کاهش حرکت، توان دستگاه --- */
  useEffect(() => {
    const st = useOrbitStore.getState();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    st.setReducedMotion(reduced);
    const low = (navigator.hardwareConcurrency ?? 8) <= 4 || window.innerWidth < 640;

    const ok = detectWebgl();
    st.setWebglOk(ok);
    if (!ok) {
      // مقداردهی یک‌باره از محیط مرورگر هنگام mount است، نه همگام‌سازی مداوم با منبع خارجی
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInit({ ready: true, initialQuat: null, lowPower: low });
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const isReturn = params.has('return') || hasVisitedOrbit();
    let quat: Quat | null = null;

    if (isReturn) {
      // بازگشت از صفحهٔ داخلی یا دکمهٔ Back مرورگر:
      // بدون مقدمه، با همان زاویهٔ قبلی، دوربین از نزدیک عقب می‌نشیند.
      quat = loadSphereQuaternion();
      orbitRuntime.scrollProgress = 1;
      orbitRuntime.returnProgress = 0;
      st.setPhase(reduced ? 'INTERACTIVE' : 'RETURNING');
    } else if (reduced) {
      orbitRuntime.scrollProgress = 1;
      st.setPhase('INTERACTIVE');
    } else {
      orbitRuntime.scrollProgress = 0;
      st.setPhase('INTRO');
    }
    setInit({ ready: true, initialQuat: quat, lowPower: low });
  }, []);

  /* --- ناوبری بعد از اتمام انیمیشن ورود --- */
  useEffect(() => {
    orbitRuntime.onEnterComplete = () => {
      const id = useOrbitStore.getState().targetId;
      const section = sections.find((s) => s.id === id);
      if (section) router.push(section.href);
    };
    return () => {
      orbitRuntime.onEnterComplete = null;
    };
  }, [router]);

  /* --- اسکرول = نزدیک‌شدن دوربین --- */
  useEffect(() => {
    if (!ready || webglOk !== true) return;
    if (phase !== 'INTRO' && phase !== 'APPROACH') return;

    const onScroll = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const max = wrap.offsetHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1;
      orbitRuntime.scrollProgress = p;
      heroRef.current?.style.setProperty('--p', String(p));
      const st = useOrbitStore.getState();
      if (p >= 0.995) {
        st.setPhase('INTERACTIVE');
        markOrbitVisited();
      } else if (p > 0.01 && st.phase === 'INTRO') {
        st.setPhase('APPROACH');
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ready, webglOk, phase]);

  /* --- قفل اسکرول صفحه وقتی گوی تعاملی است (جلوگیری از تداخل درگ و اسکرول) --- */
  useEffect(() => {
    if (!interactive) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [interactive]);

  /* --- Escape: لغو ورود در حال انجام --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        orbitRuntime.enterProgress = 0;
        useOrbitStore.getState().cancelEnter();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const skipIntro = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const reduced = useOrbitStore.getState().reducedMotion;
    window.scrollTo({
      top: wrap.offsetHeight,
      behavior: reduced ? 'auto' : 'smooth',
    });
  }, []);

  const enterSection = useCallback((id: (typeof sections)[number]['id']) => {
    useOrbitStore.getState().beginEnter(id);
  }, []);

  /* --- حالت جایگزین بدون وب‌جی‌ال --- */
  if (ready && webglOk === false) {
    return <OrbitFallback />;
  }

  return (
    <div ref={wrapRef} className="relative h-[300dvh] bg-[#07080B] text-[#F1F0EB]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        {/* بوم سه‌بعدی */}
        <div className="absolute inset-0" aria-hidden={false}>
          {ready ? (
            <OrbitCanvas
              initialQuaternion={initialQuat}
              lowPower={lowPower}
              interactive={interactive}
              onCreated={() => setFirstFrame(true)}
            />
          ) : null}
        </div>

        {/* وینیت سینمایی */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 80% at 50% 45%, transparent 55%, rgba(4,5,7,0.55) 100%)',
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#07080B]/80 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#07080B]/85 to-transparent" />

        {/* لودینگ اولیه */}
        {!firstFrame && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-[#07080B]">
            <span className="orbit-loader-ring" aria-hidden />
            <p className="text-xs text-[#777D88]">در حال آماده‌سازی جهان…</p>
            <p className="font-mono text-[10px] tracking-[0.35em] text-[#3d434f]" dir="ltr">
              ORBIT.SYS
            </p>
          </div>
        )}

        {/* نوار بالا */}
        <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <OrbitMark size={36} />
            <div className="leading-tight">
              <p className="text-sm font-bold">{profile.nameFa}</p>
              <p className="font-mono text-[9px] tracking-[0.3em] text-[#777D88]" dir="ltr">
                ORBIT — DIGITAL WORLD
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <nav aria-label="بخش‌های اصلی" className="hidden items-center gap-1 md:flex">
              {sections.map((s) => (
                <Link
                  key={s.id}
                  href={s.href}
                  className="rounded-full px-3 py-1.5 text-xs text-[#a7adb8] transition hover:bg-white/5 hover:text-[#F1F0EB] focus-visible:outline-2 focus-visible:outline-[#C7FF4A]"
                >
                  {s.labelFa}
                </Link>
              ))}
            </nav>
            {!interactive && (
              <button
                type="button"
                onClick={skipIntro}
                className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs backdrop-blur transition hover:border-[#C7FF4A]/50 hover:text-[#C7FF4A] focus-visible:outline-2 focus-visible:outline-[#C7FF4A]"
              >
                <SkipForward className="size-3.5" />
                رد کردن مقدمه
              </button>
            )}
          </div>
        </header>

        {/* هیروی مقدمه — با اسکرول محو می‌شود */}
        {!interactive && (
          <div
            ref={heroRef}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-6 pb-14 text-center"
            style={
              {
                opacity: 'calc(1 - var(--p, 0) * 1.7)',
                transform: 'translateY(calc(var(--p, 0) * 36px))',
              } as React.CSSProperties
            }
          >
            <p className="mb-4 font-mono text-[10px] tracking-[0.4em] text-[#777D88]" dir="ltr">
              ALIREZA MASHAYEKHY — FULL-STACK WEB DEVELOPER
            </p>
            <h1 className="max-w-3xl text-4xl leading-tight font-black sm:text-6xl">
              دنیای دیجیتال من را <span className="text-[#C7FF4A]">کشف کن.</span>
            </h1>
            <p className="mt-4 text-sm text-[#a7adb8] sm:text-base">{profile.subtitleFa}</p>

            <div className="mt-10 flex flex-col items-center gap-2 text-[#777D88]">
              <span className="text-xs">برای نزدیک‌شدن اسکرول کن</span>
              <ChevronDown className="size-4 animate-bounce" />
              <span className="mt-1 block h-px w-40 bg-white/10">
                <span
                  className="block h-px bg-[#C7FF4A]"
                  style={{ width: 'calc(var(--p, 0) * 100%)' }}
                />
              </span>
            </div>
          </div>
        )}

        {/* HUD حالت تعاملی */}
        {interactive && (
          <>
            {/* فهرست کناری بخش‌ها (دسکتاپ) */}
            <nav
              aria-label="فهرست مانیتورها"
              className="absolute top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-1 md:flex ltr:left-6 rtl:right-6"
              onMouseLeave={() => {
                const st = useOrbitStore.getState();
                if (st.hoverFromDom) st.setHovered(null);
              }}
            >
              {sections.map((s) => {
                const active = hoveredSection?.id === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => enterSection(s.id)}
                    onMouseEnter={() => useOrbitStore.getState().setHovered(s.id, true)}
                    onFocus={() => useOrbitStore.getState().setHovered(s.id, true)}
                    aria-label={`ورود به بخش ${s.labelFa}`}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-start transition focus-visible:outline-2 focus-visible:outline-[#C7FF4A] ${
                      active ? 'bg-white/8 text-[#F1F0EB]' : 'text-[#777D88] hover:text-[#F1F0EB]'
                    }`}
                  >
                    <span
                      className={`font-mono text-[10px] tracking-widest ${active ? 'text-[#C7FF4A]' : 'text-[#3d434f]'}`}
                      dir="ltr"
                    >
                      {s.index}
                    </span>
                    <span className="text-xs font-medium">{s.labelFa}</span>
                    <span
                      className={`font-mono text-[9px] tracking-[0.2em] transition-opacity ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`}
                      dir="ltr"
                    >
                      {s.labelEn}
                    </span>
                    <span
                      className={`h-px flex-1 transition-all ${active ? 'w-6 bg-[#C7FF4A]' : 'w-3 bg-white/15'}`}
                    />
                  </button>
                );
              })}
            </nav>

            {/* کارت اطلاعات مانیتور انتخاب‌شده / راهنما */}
            <div className="absolute inset-x-0 bottom-20 z-20 flex justify-center px-5 md:bottom-10">
              {hoveredSection ? (
                <button
                  key={hoveredSection.id}
                  type="button"
                  onClick={() => enterSection(hoveredSection.id)}
                  className="orbit-hud-card group flex max-w-xl items-center gap-4 rounded-2xl border border-white/12 bg-[#111319]/80 px-5 py-4 text-start backdrop-blur-md transition hover:border-[#C7FF4A]/60 focus-visible:outline-2 focus-visible:outline-[#C7FF4A]"
                  aria-label={`ورود به ${hoveredSection.labelFa}`}
                >
                  <span className="font-mono text-xs text-[#C7FF4A]" dir="ltr">
                    {hoveredSection.index}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-baseline gap-2">
                      <span className="text-lg font-extrabold">{hoveredSection.labelFa}</span>
                      <span
                        className="font-mono text-[10px] tracking-[0.25em] text-[#777D88]"
                        dir="ltr"
                      >
                        {hoveredSection.labelEn}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-[#a7adb8]">
                      {hoveredSection.teaserFa}
                    </span>
                  </span>
                  <span className="ms-auto flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[#C7FF4A]">
                    ورود
                    <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
                  </span>
                </button>
              ) : (
                <p className="orbit-hud-card flex items-center gap-3 rounded-full border border-white/10 bg-[#111319]/70 px-5 py-3 text-xs text-[#a7adb8] backdrop-blur-md">
                  <Move3d className="size-4 text-[#C7FF4A]" />
                  گوی را بچرخان و روی یک مانیتور کلیک کن
                  <MousePointerClick className="size-4 text-[#777D88]" />
                </p>
              )}
            </div>

            {/* چیپ‌های موبایل */}
            <nav
              aria-label="فهرست مانیتورها"
              className="absolute inset-x-0 bottom-4 z-20 flex gap-2 overflow-x-auto px-4 pb-1 md:hidden"
            >
              {sections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => enterSection(s.id)}
                  className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-medium backdrop-blur transition focus-visible:outline-2 focus-visible:outline-[#C7FF4A] ${
                    hoveredSection?.id === s.id
                      ? 'border-[#C7FF4A]/70 bg-[#C7FF4A]/10 text-[#C7FF4A]'
                      : 'border-white/12 bg-[#111319]/75 text-[#F1F0EB]'
                  }`}
                >
                  {s.labelFa}
                </button>
              ))}
            </nav>

            {/* پانوشت مختصات */}
            <p
              className="pointer-events-none absolute bottom-4 z-10 hidden font-mono text-[9px] tracking-[0.3em] text-[#3d434f] md:block ltr:right-6 rtl:left-6"
              dir="ltr"
            >
              DRAG — ROTATE · CLICK — ENTER · ESC — ABORT
            </p>
          </>
        )}

        {/* حجاب سینمایی ورود */}
        {phase === 'ENTERING' && hoveredSection && (
          <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
            <div className="orbit-veil absolute inset-0 bg-[#07080B]" />
            <p
              className="orbit-veil-label relative font-mono text-4xl font-black tracking-[0.2em] text-[#F1F0EB] sm:text-6xl"
              dir="ltr"
            >
              {hoveredSection.labelEn}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  جایگزین بدون وب‌جی‌ال — همان محتوا، بدون سه‌بعدی                       */
/* ------------------------------------------------------------------ */

export function OrbitFallback() {
  return (
    <div className="min-h-dvh bg-[#07080B] px-6 py-16 text-[#F1F0EB]">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-[10px] tracking-[0.4em] text-[#777D88]" dir="ltr">
          ALIREZA MASHAYEKHY — FULL-STACK WEB DEVELOPER
        </p>
        <h1 className="mt-4 text-4xl font-black sm:text-5xl">دنیای دیجیتال من را کشف کن.</h1>
        <p className="mt-4 max-w-2xl leading-8 text-[#a7adb8]">{profile.bioFa}</p>
        <p className="mt-3 text-xs text-[#777D88]">
          مرورگر شما از WebGL پشتیبانی نمی‌کند؛ نسخهٔ متنی جهان من در ادامه آمده است.
        </p>

        <nav aria-label="بخش‌های پورتفولیو" className="mt-12 grid gap-3 sm:grid-cols-2">
          {sections.map((s) => (
            <Link
              key={s.id}
              href={s.href}
              className="group rounded-2xl border border-white/10 bg-[#111319] p-5 transition hover:border-[#C7FF4A]/60 focus-visible:outline-2 focus-visible:outline-[#C7FF4A]"
            >
              <span className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#C7FF4A]" dir="ltr">
                  {s.index} — {s.labelEn}
                </span>
                <ArrowLeft className="size-4 text-[#777D88] transition group-hover:-translate-x-1 group-hover:text-[#C7FF4A]" />
              </span>
              <span className="mt-3 block text-lg font-bold">{s.labelFa}</span>
              <span className="mt-1 block text-sm text-[#a7adb8]">{s.teaserFa}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
