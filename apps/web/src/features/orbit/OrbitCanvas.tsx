'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { useEffect } from 'react';

import { OrbitScene } from './Scene';
import { useOrbitStore } from './store';

/**
 * همگام‌سازی touch-action روی خودِ المنت کانواس:
 * R3F به‌صورت پیش‌فرض touch-action:none می‌گذارد که اسکرول لمسی موبایل
 * در فاز نزدیک‌شدن را می‌شکست. در فاز اسکرول pan-y می‌خواهیم، در فاز درگ none.
 */
function TouchActionSync({ interactive }: { interactive: boolean }) {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    // تنظیم دستوری سبک روی المنت کانواس وب‌جی‌ال — ذاتاً imperative است
    // eslint-disable-next-line react-hooks/immutability
    gl.domElement.style.touchAction = interactive ? 'none' : 'pan-y';
  }, [gl, interactive]);
  return null;
}

export interface OrbitCanvasProps {
  initialQuaternion: { x: number; y: number; z: number; w: number } | null;
  lowPower: boolean;
  interactive: boolean;
  onCreated: () => void;
}

/**
 * بوم وب‌جی‌ال — جدا نگه داشته شده تا با dynamic import و بدون SSR لود شود
 * و هزینهٔ three.js از باندل اولیهٔ صفحه حذف شود.
 */
export default function OrbitCanvas({
  initialQuaternion,
  lowPower,
  interactive,
  onCreated,
}: OrbitCanvasProps) {
  return (
    <Canvas
      shadows={!lowPower}
      dpr={[1, lowPower ? 1.5 : 2]}
      camera={{ fov: 42, near: 0.1, far: 140, position: [0, 1.6, 13.4] }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      onCreated={(state) => {
        state.gl.setClearColor('#07080B');
        state.gl.domElement.tabIndex = 0;
        state.gl.domElement.setAttribute(
          'aria-label',
          'گوی سه‌بعدی پورتفولیو. با کلیدهای جهت‌دار بچرخانید و از فهرست بخش‌ها برای ورود استفاده کنید.',
        );
        state.gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          useOrbitStore.getState().setWebglOk(false);
        });
        onCreated();
      }}
    >
      <TouchActionSync interactive={interactive} />
      <OrbitScene initialQuaternion={initialQuaternion} lowPower={lowPower} />
    </Canvas>
  );
}
