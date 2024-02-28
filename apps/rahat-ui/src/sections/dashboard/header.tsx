'use client';

import { Button } from '@rahat-ui/shadcn/components/button';
import { Input } from '@rahat-ui/shadcn/components/input';

const Header = () => {
  return (
    <div className="flex items-center justify-between my-4">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input disabled placeholder="21 Jan 2024, 07 Feb 2024" />
        <Button type="submit">Download</Button>
      </div>
    </div>
  );
};

export default Header;
