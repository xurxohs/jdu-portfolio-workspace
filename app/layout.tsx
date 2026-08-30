import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'JDU Portfolio Workspace',
  description: 'A focused workspace for presenting JDU student systems, stories, and prototypes.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          closeButton
          duration={3600}
          position="bottom-center"
          toastOptions={{
            classNames: {
              toast: 'jdu-toast',
              title: 'jdu-toast-title',
              description: 'jdu-toast-description',
              closeButton: 'jdu-toast-close',
            },
          }}
        />
      </body>
    </html>
  );
}
