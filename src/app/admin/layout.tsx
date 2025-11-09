/**
 * Admin Layout
 * TODO: Implementar layout con sidebar para admin
 */

import { Header, Sidebar, Footer } from '@/components/layout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}
