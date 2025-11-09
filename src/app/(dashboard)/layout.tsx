/**
 * Dashboard Layout
 * TODO: Implementar header, navbar y footer
 */

import { Header, Navbar, Footer } from '@/components/layout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
