import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BackgroundLayers } from '@/components/effects/BackgroundLayers';
import { SmoothScroll } from '@/components/effects/SmoothScroll';
import { ScrollProgress } from '@/components/effects/ScrollProgress';

export const metadata: Metadata = {
  title: 'Redline — See what is suspicious before you share',
  description:
    'A credibility analyst. Paste an article. See what is suspicious. Check before you share.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll />
        <ScrollProgress />
        <BackgroundLayers />
        <div className="relative z-10 min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}