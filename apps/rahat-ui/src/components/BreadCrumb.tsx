import { Slash } from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@rahat-ui/shadcn/components/breadcrumb';
import { usePathname } from 'next/navigation';

export function RahatBreadcrumb() {
  const paths = usePathname();
  const pathNames = paths.split('/').filter((path) => path);
  return (
    <Breadcrumb className="pl-2 pr-6 py-2 bg-blur backdrop-blur">
      <BreadcrumbList>
        <BreadcrumbItem className="p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white">
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        {pathNames.map((path, i) => {
          let href = `/${pathNames.slice(0, i + 1).join('/')}`;
          return (
            <>
              <BreadcrumbItem className="p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white">
                <BreadcrumbLink href={href}>{path}</BreadcrumbLink>
              </BreadcrumbItem>

              {i !== pathNames.length - 1 && (
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
              )}
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
