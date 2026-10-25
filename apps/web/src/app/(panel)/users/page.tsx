import type { Metadata } from 'next';

import { UsersSection } from '@/features/users/components';

export const metadata: Metadata = {
  title: 'کاربران',
  // صفحهٔ نمونهٔ قالب پایه است، نه بخشی از پورتفولیو
  robots: { index: false, follow: false },
};

export default function UsersPage() {
  return <UsersSection />;
}
