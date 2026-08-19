import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import '@/index.css';

export const metadata: Metadata = {
  title: '연OX',
  description: '연OX - 건강한 연애를 위한 연애 커뮤니티',
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
    <html lang="ko" suppressHydrationWarning>
      <body className="bg-[#F8FAFC] text-[#0F172A] antialiased min-h-screen selection:bg-[#FFF3F4] selection:text-[#FF5D7B]" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
