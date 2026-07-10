'use client';

import { ReactNode } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-60 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
