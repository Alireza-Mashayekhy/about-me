'use client';

import { ArrowUpLeft, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

import { OrbitMark } from '@/components/portfolio/orbit-mark';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // در آینده: ارسال به سرویس پایش خطا
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-[#07080B] px-6 text-center text-[#F1F0EB]">
      <OrbitMark size={64} />

      <div>
        <p className="font-mono text-xs tracking-[0.4em] text-[#C7FF4A]" dir="ltr">
          ORBIT — SYSTEM FAULT
        </p>
        <h1 className="mt-4 text-3xl font-black">مشکلی پیش آمد</h1>
        <p className="mx-auto mt-3 max-w-md leading-8 text-[#a7adb8]">
          در نمایش این صفحه خطایی رخ داد. می‌توانی دوباره تلاش کنی یا به گوی اصلی برگردی.
        </p>
        {error.digest ? (
          <p className="mt-3 font-mono text-xs text-[#777D88]" dir="ltr">
            {error.digest}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-2 rounded-full bg-[#C7FF4A] px-6 py-3 text-sm font-bold text-[#07080B] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C7FF4A]"
        >
          <RotateCcw className="size-4" />
          تلاش دوباره
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold transition hover:border-[#C7FF4A]/60 hover:text-[#C7FF4A] focus-visible:outline-2 focus-visible:outline-[#C7FF4A]"
        >
          بازگشت به جهان من
          <ArrowUpLeft className="size-4" />
        </Link>
      </div>
    </div>
  );
}
