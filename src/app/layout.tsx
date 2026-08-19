import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import '@/index.css';

export const metadata: Metadata = {
  title: 'LOVE ADMIN - Service Management',
  description: 'Love Admin Service Management Dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
