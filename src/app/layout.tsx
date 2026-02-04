import type { Metadata } from 'next';
import { Noto_Sans_JP, M_PLUS_Rounded_1c } from 'next/font/google';
import Header from '@/components/Header';
import PageLayout from '@/layout/PageLayout';
import classNames from 'classnames';
import '@/styles/global.scss';

const notoSansJP = Noto_Sans_JP({
  variable: '--font-noto-sans-jp',
  subsets: ['latin'],
});
const mPlusRounded1c = M_PLUS_Rounded_1c({
  variable: '--font-m-plus-rounded-1c',
  subsets: ['latin'],
  weight: ['500'],
});

export const metadata: Metadata = {
  title: 'AITガイド',
  description: '愛工大の施設・教室の位置や経路を確認できます',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
      </head>
      <body className={classNames(notoSansJP.variable, mPlusRounded1c.variable, 'antialiased')}>
        <Header />
        <PageLayout>{children}</PageLayout>
      </body>
    </html>
  );
}
