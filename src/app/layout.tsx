import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'منام',
  description: 'منام',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
