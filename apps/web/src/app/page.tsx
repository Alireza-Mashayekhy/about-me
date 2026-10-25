import Link from 'next/link';

import { profile, sections } from '@/data/portfolio';
import { OrbitExperience } from '@/features/orbit/OrbitExperience';

/**
 * صفحهٔ اصلی: تجربهٔ سه‌بعدی ORBIT.
 * محتوای متنی حیاتی (نام، عنوان، ناوبری بخش‌ها) عمداً در DOM سروری هم هست
 * تا برای موتورهای جست‌وجو و فناوری‌های کمکی مستقل از وب‌جی‌ال در دسترس باشد.
 */
export default function HomePage() {
  return (
    <>
      {/* محتوای قابل خواندن برای ابزارهای کمکی و سئو — بصری پنهان است
          چون همان محتوا در تجربهٔ سه‌بعدی و HUD هم نمایش داده می‌شود */}
      <div className="sr-only">
        <h1>
          {profile.nameFa} — {profile.roleFa}
        </h1>
        <p>{profile.bioFa}</p>
        <nav aria-label="بخش‌های پورتفولیو">
          <ul>
            {sections.map((s) => (
              <li key={s.id}>
                <Link href={s.href}>{s.labelFa}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <noscript>
        <div className="bg-[#07080B] px-6 py-16 text-[#F1F0EB]">
          <h1 className="text-3xl font-black">
            {profile.nameFa} — {profile.roleFa}
          </h1>
          <p className="mt-4 max-w-2xl leading-8 text-[#a7adb8]">{profile.bioFa}</p>
          <ul className="mt-8 space-y-2">
            {sections.map((s) => (
              <li key={s.id}>
                <Link className="text-[#C7FF4A] underline" href={s.href}>
                  {s.labelFa}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </noscript>

      <OrbitExperience />
    </>
  );
}
