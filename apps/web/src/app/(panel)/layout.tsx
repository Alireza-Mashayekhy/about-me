import { AppHeader } from '@/components/layout/app-header';

/**
 * پوستهٔ قالب پایه (هدر + کانتینر + فوتر) فقط برای مسیرهای نمونهٔ قبلی
 * مثل /users — صفحات ORBIT بیرون از این گروه و تمام‌صفحه‌اند.
 */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>

      <footer className="border-t px-4 py-6 text-center text-xs text-muted-foreground">
        ساخته‌شده با قالب پایهٔ راوند
      </footer>
    </div>
  );
}
