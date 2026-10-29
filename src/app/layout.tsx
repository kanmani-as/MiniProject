import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'UtsavHub - Local Event and Festival Information Portal',
  description: 'Discover upcoming cultural programmes, temple festivals, college competitions, fairs, exhibitions, concerts, and celebrations in your town.',
  keywords: 'local events, festival portal, temple festivals, college fests, fairs, exhibitions, sangeet, cultural events, Karnataka',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased flex flex-col min-h-screen text-slate-800 bg-slate-50/50">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
