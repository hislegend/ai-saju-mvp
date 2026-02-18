import type { Metadata } from 'next';
import { Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/common/site-header';
import { SiteFooter } from '@/components/common/site-footer';

const bodyFont = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '700'],
});

const headingFont = Noto_Serif_KR({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'AI 사주 랩 | MBTI 맞춤 사주 리딩',
    template: '%s | AI 사주 랩',
  },
  description:
    '무료 1분 사주부터 프리미엄 상세 리포트까지. MBTI 해석 톤 개인화로 같은 사주도 다르게 읽어드립니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${bodyFont.variable} ${headingFont.variable}`}>
        <SiteHeader />
        <main className="app-main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
