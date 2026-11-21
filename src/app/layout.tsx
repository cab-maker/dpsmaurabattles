import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Aura Battles — The School Arena',
  description: 'The official school Aura Battles platform. Submit battles, see active campus locations, and view the live leaderboard of champions.',
  keywords: ['aura', 'battles', 'school', 'arena', 'leaderboard', 'mog battle'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#060709] text-[#f4f4f6] flex flex-col antialiased selection:bg-pink-500/30 selection:text-white">
        <Navbar />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
