import { useState } from 'react';
import { useTheme } from 'next-themes';

import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';

export default function ThemeSwitch() {
  const { setTheme } = useTheme();
  const [isChecked, setIsChecked] = useState(true);
  const handleSwitchChange = () => {
    setTheme(isChecked ? 'dark' : 'light');

    setIsChecked(!isChecked);
  };

  return (
    <div className="flex items-center space-x-2 p-1">
      <Label htmlFor="theme">{isChecked ? 'Light' : 'Dark'}</Label>
      <Switch id="theme" onCheckedChange={handleSwitchChange} />
    </div>
  );
}
