import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://jdu-signal-archive.ishonchsavdo1.chatgpt.site'),
  title: 'JDU Portfolio — Student projects, one shared archive',
  description: 'Discover projects made at JDU, meet their creators, ask questions, and publish your own student work.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'JDU Portfolio',
    description: 'Student projects, one shared archive.',
    images: [{ url: '/og.png', width: 1792, height: 1024, alt: 'JDU Portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JDU Portfolio',
    description: 'Student projects, one shared archive.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
