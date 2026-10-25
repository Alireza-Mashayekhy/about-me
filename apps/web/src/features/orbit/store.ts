'use client';

import { create } from 'zustand';

import type { SectionId } from '@/data/portfolio';

/**
 * ماشین حالت تجربهٔ ORBIT
 *
 * INTRO         → نمای دور؛ کاربر هنوز اسکرول نکرده
 * APPROACH      → دوربین با اسکرول به گوی نزدیک می‌شود (۰ < پیشرفت < ۱)
 * INTERACTIVE   → گوی قابل چرخاندن و مانیتورها قابل انتخاب‌اند
 * ENTERING      → انیمیشن سینمایی ورود به مانیتور در حال اجراست
 * RETURNING     → تازه از صفحهٔ داخلی برگشته‌ایم؛ دوربین در حال عقب‌نشینی است
 *
 * حالت SECTION_OPEN حالتِ خودِ مسیرهای داخلی است (route جدا)،
 * پس اینجا نگه داشته نمی‌شود.
 */
export type OrbitPhase = 'INTRO' | 'APPROACH' | 'INTERACTIVE' | 'ENTERING' | 'RETURNING';

interface OrbitState {
  phase: OrbitPhase;
  /** مانیتوری که نشانگر/تمرکز الان روی آن است */
  hoveredId: SectionId | null;
  /**
   * هاور از فهرست DOM آمده یا از برخورد واقعی اشاره‌گر با سطح سه‌بعدی؟
   * کلیک روی کانواس فقط وقتی وارد بخش می‌شود که برخورد واقعی بوده باشد.
   */
  hoverFromDom: boolean;
  /** مانیتوری که در حال ورود به آن هستیم */
  targetId: SectionId | null;
  /** وب‌جی‌ال در دسترس است؟ (null = هنوز نمی‌دانیم) */
  webglOk: boolean | null;
  reducedMotion: boolean;
  setPhase: (phase: OrbitPhase) => void;
  setHovered: (id: SectionId | null, fromDom?: boolean) => void;
  beginEnter: (id: SectionId) => void;
  cancelEnter: () => void;
  setWebglOk: (ok: boolean) => void;
  setReducedMotion: (v: boolean) => void;
}

export const useOrbitStore = create<OrbitState>()((set, get) => ({
  phase: 'INTRO',
  hoveredId: null,
  hoverFromDom: false,
  targetId: null,
  webglOk: null,
  reducedMotion: false,
  setPhase: (phase) => set({ phase }),
  setHovered: (hoveredId, fromDom = false) => {
    const cur = get();
    if (cur.hoveredId !== hoveredId || cur.hoverFromDom !== fromDom) {
      set({ hoveredId, hoverFromDom: fromDom });
    }
  },
  beginEnter: (id) => {
    // گارد انتقال: فقط از حالت INTERACTIVE می‌شود وارد بخش شد.
    // کلیک‌های پشت‌سرهم هنگام انیمیشن نادیده گرفته می‌شوند.
    if (get().phase !== 'INTERACTIVE') return;
    set({ phase: 'ENTERING', targetId: id, hoveredId: id });
  },
  cancelEnter: () => {
    if (get().phase === 'ENTERING') set({ phase: 'INTERACTIVE', targetId: null });
  },
  setWebglOk: (webglOk) => set({ webglOk }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}));

/* ------------------------------------------------------------------ */
/*  وضعیت گذرا (transient) — عمداً بیرون از React نگه داشته می‌شود تا    */
/*  حلقهٔ رندر ۶۰فریمی باعث ری‌رندر کامپوننت‌ها نشود.                     */
/* ------------------------------------------------------------------ */

export const orbitRuntime = {
  /** پیشرفت اسکرول مرحلهٔ نزدیک‌شدن: ۰ تا ۱ */
  scrollProgress: 0,
  /** پیشرفت انیمیشن ورود: ۰ تا ۱ */
  enterProgress: 0,
  /** پیشرفت بازگشت: ۰ تا ۱ */
  returnProgress: 0,
  /** وقتی انیمیشن ورود تمام شد صدا زده می‌شود (ناوبری به صفحهٔ بخش) */
  onEnterComplete: null as (() => void) | null,
  /** آخرین زمان تعامل کاربر با گوی (برای چرخش خودکار در حالت بیکار) */
  lastInteractionAt: 0,
};

/* ------------------------------------------------------------------ */
/*  حفظ موقعیت گوی بین صفحهٔ اصلی و صفحات داخلی (sessionStorage)        */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'orbit:sphere-quaternion:v1';
const VISITED_KEY = 'orbit:visited:v1';

export function saveSphereQuaternion(q: { x: number; y: number; z: number; w: number }) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(q));
    sessionStorage.setItem(VISITED_KEY, '1');
  } catch {
    /* حالت خصوصی مرورگر — بی‌خیال شو */
  }
}

export function loadSphereQuaternion(): { x: number; y: number; z: number; w: number } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { x?: unknown; y?: unknown; z?: unknown; w?: unknown };
    if (
      typeof parsed.x !== 'number' ||
      typeof parsed.y !== 'number' ||
      typeof parsed.z !== 'number' ||
      typeof parsed.w !== 'number'
    ) {
      return null;
    }
    return { x: parsed.x, y: parsed.y, z: parsed.z, w: parsed.w };
  } catch {
    return null;
  }
}

export function hasVisitedOrbit(): boolean {
  try {
    return sessionStorage.getItem(VISITED_KEY) === '1';
  } catch {
    return false;
  }
}

export function markOrbitVisited() {
  try {
    sessionStorage.setItem(VISITED_KEY, '1');
  } catch {
    /* ignore */
  }
}
