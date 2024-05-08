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

function isValidUUID(uuid: string) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function RahatBreadcrumb() {
  const paths = usePathname();
  const pathNames = paths.split('/').filter((path) => path);
  return (
    <Breadcrumb className="pl-2 pr-2 py-2 bg-blur backdrop-blur">
      <BreadcrumbList>
        {pathNames.map((path, i) => {
          let href = `/${pathNames.slice(0, i + 1).join('/')}`;
          if (!isValidUUID(path))
            return (
              <>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem className="p-3 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white">
                  <BreadcrumbLink className="hover:text-white" href={href}>
                    {path}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
