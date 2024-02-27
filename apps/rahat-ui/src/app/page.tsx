'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { paths } from '../routes/paths';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push(paths.dashboard.root);
  }, [router]);
}
