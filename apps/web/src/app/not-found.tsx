import { ArrowUpLeft } from 'lucide-react';
import Link from 'next/link';

import { OrbitMark } from '@/components/portfolio/orbit-mark';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-[#07080B] px-6 text-center text-[#F1F0EB]">
      <OrbitMark size={64} />

      <div>
        <p className="font-mono text-xs tracking-[0.4em] text-[#C7FF4A]" dir="ltr">
          404 — SIGNAL LOST
        </p>
        <h1 className="mt-4 text-3xl font-black sm:text-4xl">این نقطه در جهان من نیست</h1>
        <p className="mx-auto mt-3 max-w-md leading-8 text-[#a7adb8]">
          آدرسی که وارد کردی وجود ندارد یا جابه‌جا شده است. به گوی برگرد و از یک مانیتور دیگر وارد
          شو.
        </p>
      </div>

      <Link
        href="/"
        className="flex items-center gap-2 rounded-full bg-[#C7FF4A] px-6 py-3 text-sm font-bold text-[#07080B] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C7FF4A]"
      >
        ورود به جهان من
        <ArrowUpLeft className="size-4" />
      </Link>
    </div>
  );
}
