'use client';

import { Nav } from '../../components/nav';
import AuthGuard from '../../guards/auth-guard';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <Nav />
      <div className="p-4 bg-secondary h-[calc(100vh-56px)]">{children}</div>
    </AuthGuard>
  );
}
