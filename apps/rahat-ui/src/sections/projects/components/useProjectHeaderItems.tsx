import { useProject, useProjectList, useProjectStore } from '@rahat-ui/query';
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
import { Check, ChevronDown, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import type { Project } from '@rahataid/sdk/project/project.types';

export const useProjectHeaderItems = (projectType: string) => {
  const { id } = useParams();
  const router = useRouter();
  useProject(id as UUID);
  const { data: projectList } = useProjectList();

  const project = useProjectStore((p) => p.singleProject);
  const { data, subData } = useNavData();
  const currentPath = usePathname();

  const projectName = project?.name || '';
  const isCVA = project?.type === 'cva';
  const projects: Project[] = projectList?.data ?? [];

  const handleSwitchProject = (target: Project) => {
    if (!target.uuid || target.uuid === id) return;
    // Keep the current sub-page (e.g. /stakeholders) when staying in the
    // same project section, otherwise land on the new project's dashboard.
    const segments = currentPath.split('/');
    const rest = segments.slice(4).join('/');
    const base = `/projects/${(target.type || '').toLowerCase()}/${
      target.uuid
    }`;
    const sameSection =
      (target.type || '').toLowerCase() === segments[2]?.toLowerCase();
    router.push(sameSection && rest ? `${base}/${rest}` : base);
  };

  const projectHeader = (
    <div className="flex items-center ">
      <Badge className="bg-blue-500 text-white rounded-full px-3 py-1">
        {isCVA ? 'CASH VOUCHER ASSITANCE' : projectType}
      </Badge>
      <DropdownMenu>
        <DropdownMenuTrigger className="ml-1 flex items-center gap-2 rounded-sm px-2 py-1  border hover:bg-secondary hover:rounded-sm">
          <span className="text-base font-semibold text-foreground">
            {projectName || 'Select project'}
          </span>
          <ChevronDown size={16} className="text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72 rounded-sm">
          {projects.map((p) => {
            const isCurrent = p.uuid === id;
            return (
              <DropdownMenuItem
                key={p.uuid}
                onClick={() => handleSwitchProject(p)}
                className="flex cursor-pointer items-center gap-2"
              >
                <span className="flex-1">
                  <span className="block text-sm font-medium">
                    {p.name || 'Untitled project'}
                  </span>
                </span>
                {isCurrent && <Check size={16} className="text-primary" />}
              </DropdownMenuItem>
            );
          })}
          {projects.length === 0 && (
            <p className="px-2 py-1.5 text-sm text-muted-foreground">
              No projects found
            </p>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
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
