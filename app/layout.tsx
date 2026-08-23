import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JDU / Signal Archive',
  description: 'A living archive of student-made systems, places, and ideas from JDU Tashkent.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
