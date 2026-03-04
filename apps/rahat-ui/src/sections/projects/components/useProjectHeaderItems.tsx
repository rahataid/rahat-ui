import { useProject, useProjectStore } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { ProjectTypes } from '@rahataid/sdk/enums';
import { useNavData } from 'apps/rahat-ui/src/app/config-nav';
import { paths } from 'apps/rahat-ui/src/routes/paths';
import { UUID } from 'crypto';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export const useProjectHeaderItems = (projectType: string) => {
  const { id } = useParams();
  useProject(id as UUID);

  const project = useProjectStore((p) => p.singleProject);
  const { data, subData } = useNavData();
  const currentPath = usePathname();

  const projectName = project?.name || '';
  const projectHeader = (
    <div className="flex items-center">
      <Badge className="bg-blue-500 text-white rounded-full px-3 py-1">
        {projectType}
      </Badge>
      <span className="ml-2 text-gray-700">{projectName}</span>
    </div>
  );

  const defaultHeader = (
    <div className="flex gap-12">
      <Link href={paths.dashboard.root} className="flex items-center">
        <Image
          src="/rahat_logo_standard.png"
          alt="rahat-logo"
          height={120}
          width={120}
        />
      </Link>
      <nav className="hidden md:flex items-center text-secondary-foreground">
        {data.map((item) =>
          item.children ? (
            <DropdownMenu key={item.title}>
              <DropdownMenuTrigger className="py-2 px-4 cursor-pointer border:none text-md">
                {item.title}
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent>
                  {item.children.map((child) => (
                    <Link key={child.title} href={child.path}>
                      <DropdownMenuItem className="cursor-pointer">
                        {child.title}
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>
          ) : (
            <Link key={item.title} href={item.path}>
              <p
                className={`py-2 px-4 text-md  rounded ${
                  currentPath === item.path && 'bg-secondary text-primary'
                }`}
              >
                {item.title}
              </p>
            </Link>
          ),
        )}
        <DropdownMenu>
          <DropdownMenuTrigger className="py-2 px-4 rounded">
            More...
          </DropdownMenuTrigger>
          <DropdownMenuContent className="ml-12">
            {
              subData.map((item) => (
                // item?.children ? (
                //   <DropdownMenuSub key={item.title}>
                //     <DropdownMenuSubTrigger>
                //       {item.title}
                //     </DropdownMenuSubTrigger>
                //     <DropdownMenuPortal>
                //       <DropdownMenuSubContent>
                //         {item.children.map((child) => (
                //           <Link key={child.title} href={child.path}>
                //             <DropdownMenuItem className="cursor-pointer">
                //               {child.title}
                //             </DropdownMenuItem>
                //           </Link>
                //         ))}
                //       </DropdownMenuSubContent>
                //     </DropdownMenuPortal>
                //   </DropdownMenuSub>
                // ) : (
                <Link key={item.title} href={item.path}>
                  <DropdownMenuItem className="cursor-pointer text-muted-foreground">
                    {item.title}
                  </DropdownMenuItem>
                </Link>
              ))
              // )
            }
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  );

  return {
    headerNav: projectType !== ProjectTypes.EL ? projectHeader : defaultHeader,
  };
};
