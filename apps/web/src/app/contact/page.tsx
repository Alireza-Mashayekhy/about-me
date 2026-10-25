import type { Metadata } from 'next';

import { SectionShell } from '@/components/portfolio/section-shell';
import { ContactSection } from '@/features/contact/contact-section';

export const metadata: Metadata = {
  title: 'ارتباط',
  description: 'راه‌های ارتباط با علیرضا مشایخی، توسعه‌دهنده فول‌استک وب، برای شروع یک همکاری.',
};

export default function ContactPage() {
  return (
    <SectionShell sectionId="contact">
      <ContactSection />
    </SectionShell>
  );
}
