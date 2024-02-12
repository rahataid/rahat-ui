'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { paths } from '../routes/paths';
import { useGet } from '@rahat-ui/query/hooks';

export default function Home() {
  const router = useRouter();
  console.log(process.env.NEXT_PUBLIC_HOST_API);
  const { data, error, isLoading } = useGet({
    queryKey: ['myData', { param1: 'value1' }], // replace with your query key and parameters
    queryFn: async () => {
      const response = await fetch('https://api.example.com/data'); // replace with your API endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    initialData: undefined,
  });
  useEffect(() => {
    router.push(paths.dashboard.root);
  }, [router]);
}
