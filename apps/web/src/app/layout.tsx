import './globals.css';

import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

import { profile } from '@/data/portfolio';

import { Providers } from './providers';

/**
 * فونت وزیرمتن به‌صورت متغیر و self-hosted.
 * چرا محلی؟ چون CDNها در ایران ناپایدار/فیلترند و وابستگی به درخواست
 * خارجی در زمان build برای یک قالب قابل‌قبول نیست.
 */
const vazirmatn = localFont({
  src: './fonts/vazirmatn-variable.woff2',
  variable: '--font-vazirmatn',
  display: 'swap',
  weight: '100 900',
  fallback: ['system-ui', 'Tahoma', 'Arial', 'sans-serif'],
});

export const metadata: Metadata = {
  title: {
    default: `${profile.nameFa} — ${profile.roleFa} | ORBIT`,
    template: `%s | ${profile.nameFa} — ORBIT`,
  },
  description: profile.bioFa,
  applicationName: 'ORBIT — دنیای دیجیتال علیرضا مشایخی',
  authors: [{ name: profile.nameEn }],
  keywords: [
    'علیرضا مشایخی',
    'Alireza Mashayekhy',
    'توسعه‌دهنده فول‌استک',
    'Full-Stack Web Developer',
    'React',
    'Next.js',
    'Vue.js',
    'Node.js',
    'NestJS',
  ],
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    title: `${profile.nameFa} — ${profile.roleFa}`,
    description: profile.bioFa,
    siteName: 'ORBIT',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#07080B',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning className={vazirmatn.variable}>
      {/* پس‌زمینهٔ پیش‌فرض مشکی است تا قبل از لودشدن وب‌جی‌ال فلش سفید نبینیم؛
          مسیرهای قالب پایه داخل (panel) پس‌زمینهٔ خودشان را می‌گذارند. */}
      <body className="min-h-screen bg-[#07080B] text-[#F1F0EB] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
