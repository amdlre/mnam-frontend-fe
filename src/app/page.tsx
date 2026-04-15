import { redirect } from 'next/navigation';

import { APP_CONFIG } from '@/constants/config';

export default function RootPage() {
  redirect(`/${APP_CONFIG.i18n.defaultLocale}`);
}
