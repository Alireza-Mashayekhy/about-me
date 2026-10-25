import type { Metadata } from 'next';

import { SectionShell } from '@/components/portfolio/section-shell';
import { WorkGallery } from '@/features/work/work-gallery';

export const metadata: Metadata = {
  title: 'پروژه‌ها',
  description:
    'نمونه‌کارهای واقعی و منتشرشدهٔ علیرضا مشایخی؛ از مارکت‌پلیس و فروشگاه اینترنتی تا پلتفرم سلامت روان و وب‌سایت‌های شرکتی.',
};

export default function WorkPage() {
  return (
    <SectionShell sectionId="work">
      <WorkGallery />
    </SectionShell>
  );
}
