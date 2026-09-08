import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { ExternalLinkIcon } from 'lucide-react';
import { weatherServices } from './constant';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { useTranslations } from 'next-intl';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

export default function ExternalLinks() {
  const t = useTranslations('AA_PROJECT');
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
        {weatherServices.map((service, index) => (
          <a
            key={index}
            href={service.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <Card className="h-full  border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer rounded-sm shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-start justify-between gap-2">
                  <span className="leading-tight">
                    {translateValue(t, service.titleKey, { fallback: service.title })}
                  </span>
                  <TooltipComponent
                    Icon={ExternalLinkIcon}
                    tip={t('REDIRECT_TO', { name: service.subtitle })}
                    handleOnClick={() => undefined}
                    iconStyle="text-primary"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Badge className="text-gray-600 text-xs font-medium w-auto">
                  {translateValue(t, service.subtitleKey, { fallback: service.subtitle })}
                </Badge>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
