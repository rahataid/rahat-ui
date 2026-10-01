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
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import ConfirmationDialog from 'apps/rahat-ui/src/common/confirmationDialog';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import type { Project } from '@rahataid/sdk/project/project.types';
import { StatusBadge } from '../projectList';
import { useTranslations } from 'next-intl';

export const useProjectHeaderItems = (projectType: string) => {
  const { id } = useParams();
  const router = useRouter();
  useProject(id as UUID);
  const { data: projectList } = useProjectList();
  const projectSwitchDialog = useBoolean(false);
  const [pendingProject, setPendingProject] = useState<Project | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');

  const handleMenuOpenChange = (open: boolean) => {
    setMenuOpen(open);
    if (!open) setProjectSearch('');
  };
  const tg = useTranslations('GLOBAL');

  const project = useProjectStore((p) => p.singleProject);
  const { data, subData } = useNavData();
  const currentPath = usePathname();

  const projectName = project?.name || '';
  const isCVA = project?.type === 'cva';
  const projects: Project[] = projectList?.data ?? [];

  const visibleProjects = projects.filter((p) => {
    const q = projectSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.type || '').toLowerCase().includes(q) ||
      (p.status || '').toLowerCase().includes(q)
    );
  });

  const handleSelectProject = (target: Project) => {
    if (!target.uuid || target.uuid === id) return;
    setPendingProject(target);
    projectSwitchDialog.onTrue();
  };

  const confirmProjectSwitch = () => {
    if (pendingProject) handleSwitchProject(pendingProject);
    setPendingProject(null);
    projectSwitchDialog.onFalse();
  };

  const cancelProjectSwitch = () => {
    setPendingProject(null);
    projectSwitchDialog.onFalse();
  };

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
      {/* <Badge className="bg-blue-500 text-white rounded-full px-3 py-1">
        {isCVA ? 'CASH VOUCHER ASSITANCE' : projectType}
      </Badge> */}
      <DropdownMenu open={menuOpen} onOpenChange={handleMenuOpenChange}>
        <DropdownMenuTrigger className="ml-2 flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-secondary border rounded-sm">
          <span className="flex gap-2 items-center">
            <span className="text-[15px] font-bold  text-foreground">
              {projectName || 'Select project'}
            </span>
            <Badge
              variant="outline"
              className="border-primary text-primary cursor-auto bg-secondary"
            >
              {project?.type?.toUpperCase()}
            </Badge>
          </span>
          <ChevronDown size={16} className="shrink-0 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-80 p-1.5">
          <p className="px-2 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {tg('SWITCH_PROJECT')}
          </p>
          <div
            className="relative px-1 pb-1.5"
            onKeyDown={(e) => {
              // Keep typing in the search box from triggering the menu's
              // built-in typeahead; Escape/Tab still reach the menu.
              if (e.key !== 'Escape' && e.key !== 'Tab') e.stopPropagation();
            }}
          >
            <Search
              size={14}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-[calc(50%+2px)] text-muted-foreground"
            />
            <Input
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
              placeholder="Search projects..."
              className="h-8 pl-8 text-sm"
            />
          </div>
          <ScrollArea className="max-h-[300px]">
            {visibleProjects.map((p) => {
              const isCurrent = p.uuid === id;
              return (
                <DropdownMenuItem
                  key={p.uuid}
                  // preventDefault skips Radix's default select-close sequence,
                  // whose focus cleanup would otherwise dismiss the confirm
                  // dialog opened synchronously below.
                  onSelect={(e) => {
                    e.preventDefault();
                    setMenuOpen(false);
                    handleSelectProject(p);
                  }}
                  className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 ${
                    isCurrent ? 'bg-accent' : ''
                  }`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="truncate text-sm font-semibold">
                      {p?.name || 'Untitled project'}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className="border-primary text-primary cursor-auto bg-secondary"
                      >
                        {p?.type?.toUpperCase()}
                      </Badge>
                      <StatusBadge status={p?.status} />
                    </span>
                  </span>
                  {isCurrent && (
                    <Check size={15} className="shrink-0 text-primary" />
                  )}
                </DropdownMenuItem>
              );
            })}
            {visibleProjects.length === 0 && (
              <p className="px-2 py-1.5 text-sm text-muted-foreground">
                {projects.length === 0
                  ? 'No projects found'
                  : 'No matching projects'}
              </p>
            )}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmationDialog
        isConfirmationDialogOpen={projectSwitchDialog.value}
        onCancel={cancelProjectSwitch}
        onConfirm={confirmProjectSwitch}
        dialogTitle={tg('SWITCH_PROJECT')}
        dialogMessage={
          pendingProject
            ? tg('SWITCH_PROJECT_DESCRIPTION', {
                projectName: pendingProject.name ?? 'Untitled project',
              })
            : undefined
        }
      />
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
