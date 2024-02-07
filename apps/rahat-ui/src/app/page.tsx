'use client';

import { Button } from '@rahat-ui/shadcn/components/button';

export default function Page() {
  return (
    <main>
      <Button
        onClick={() => {
          console.log('clicked');
        }}
      >
        Click me
      </Button>
    </main>
  );
}
