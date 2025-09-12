'use client';

import {
  Card,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';

export default function ComingSoonView() {
  return (
    <div className="h-[calc(100vh-56px)] flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-black p-4">
      <Card className="w-full max-w-md text-center shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">🚀 Coming Soon</CardTitle>
          <p className="text-gray-400 mt-2">
            We're working hard to give you something amazing. Stay tuned!
          </p>
        </CardHeader>
      </Card>
    </div>
  );
}
