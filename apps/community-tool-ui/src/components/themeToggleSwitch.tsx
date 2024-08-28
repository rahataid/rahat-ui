import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';

export default function ThemeSwitch() {
  const { setTheme } = useTheme();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    setIsChecked(storedTheme === 'dark');
  }, []);

  const handleSwitchChange = () => {
    const newTheme = isChecked ? 'light' : 'dark';
    setTheme(newTheme);

    localStorage.setItem('theme', newTheme);

    setIsChecked(!isChecked);
  };

  return (
    <div className="flex items-center space-x-2 p-1">
      <Label htmlFor="theme">{isChecked ? 'Dark' : 'Light'}</Label>
      <Switch
        id="theme"
        checked={isChecked}
        onCheckedChange={handleSwitchChange}
      />
    </div>
  );
}
