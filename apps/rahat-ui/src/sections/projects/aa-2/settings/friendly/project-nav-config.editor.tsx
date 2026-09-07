'use client';

import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { SettingDataType, useAAProjectSettingsList } from '@rahat-ui/query';
import { defaultNavConfig } from 'apps/rahat-ui/src/utils/resolvedIcon';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';

const setsAreEqual = (a: Set<string>, b: Set<string>) =>
  a.size === b.size && [...a].every((value) => b.has(value));

const SETTING_NAME = 'PROJECT_NAV_CONFIG';

type IProps = {
  submitRef?: MutableRefObject<
    (() => { name: string; value: unknown } | null) | null
  >;
};

export default function ProjectNavConfigEditor({ submitRef }: IProps) {
  const { id } = useParams();
  const projectUUID = id as UUID;

  const { data: settings, isLoading } = useAAProjectSettingsList(projectUUID);
  const currentSetting = settings?.find((s: any) => s.name === SETTING_NAME);

  const [checkedTitles, setCheckedTitles] = useState<Set<string>>(new Set());
  const initialTitlesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const navsettings = currentSetting?.value?.navsettings;
    const titles = navsettings
      ? navsettings.map((item: any) => item.title)
      : defaultNavConfig.navsettings.map((item) => item.title);
    const initial = new Set<string>(titles);
    initialTitlesRef.current = initial;
    setCheckedTitles(initial);
  }, [currentSetting]);

  const toggleTitle = (title: string, checked: boolean) => {
    setCheckedTitles((prev) => {
      const next = new Set(prev);
      if (checked) next.add(title);
      else next.delete(title);
      return next;
    });
  };

  const handleSubmit = () => {
    // Don't submit this setting if the user never touched it — avoids
    // overwriting other settings' values when only one editor was edited.
    if (setsAreEqual(checkedTitles, initialTitlesRef.current)) return null;

    const navsettings = defaultNavConfig.navsettings.filter((item) =>
      checkedTitles.has(item.title),
    );

    return {
      name: SETTING_NAME,
      value: { navsettings },
      dataType: SettingDataType.OBJECT,
    };
  };

  useEffect(() => {
    if (submitRef) submitRef.current = handleSubmit;
  });

  if (isLoading) {
    return <div className="p-4 text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="rounded border bg-white p-4">
      <div className="mb-3">
        <h2 className="text-sm font-semibold">Project Navigation</h2>
        <p className="text-xs text-muted-foreground">
          Choose which pages are enabled for this project.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {defaultNavConfig.navsettings.map((item) => (
          <div
            key={item.title }
            className="flex items-center space-x-2"
          >
            <Checkbox
              id={`nav-path-${item.title}`}
              checked={checkedTitles.has(item.title)}
              onCheckedChange={(checked) =>
                toggleTitle(item.title, checked === true)
              }
            />
            <Label htmlFor={`nav-path-${item.title }`}>
              {item.title || '(root)'}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
