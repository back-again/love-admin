import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import '@/index.css';

export const metadata: Metadata = {
  title: '연OX',
  description: '연OX - 집단지성과 AI로 푸는 연애 고민 솔루션',
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
