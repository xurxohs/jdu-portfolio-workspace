import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JDU Portfolio Workspace',
  description: 'A focused workspace for presenting JDU student systems, stories, and prototypes.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
