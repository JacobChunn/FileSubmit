import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: {
    template: '%s | Encore Automation',
    default: 'Encore Automation',
  },
  description: 'Encore Automation\'s Timesheet Application - made by Jake Chunn',
  metadataBase: new URL('https://file-submit-qf8y.vercel.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
