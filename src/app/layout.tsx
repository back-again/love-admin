import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import '@/index.css';

export const metadata: Metadata = {
  title: '연OX (XOXO) - 서비스 및 관리자',
  description: '연OX (XOXO) 서비스 및 관리 콘솔',
  verification: {
    google: 'D2yfu5dFgRdP43LeXVp8AB5J0xfbWm4xSOzFt836atE',
  },
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
