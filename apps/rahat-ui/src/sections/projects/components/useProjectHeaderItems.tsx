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
import { useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import ConfirmationDialog from 'apps/rahat-ui/src/common/confirmationDialog';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import type { Project } from '@rahataid/sdk/project/project.types';
import { StatusBadge } from '../projectList';

function ProjectStatusDot({
  status,
  textClassName = 'text-xs',
}: {
  status?: string;
  textClassName?: string;
}) {
  if (!status) return null;
  const dotColor =
    status === 'ACTIVE'
      ? 'bg-green-500'
      : status === 'NOT_READY'
      ? 'bg-yellow-500'
      : 'bg-red-500';
  return (
    <span className="flex items-center gap-1 ">
      <span className={`h-2 w-2 shrink-0 rounded-full ${dotColor}`} />
      <span className={`font-medium text-foreground  ${textClassName}`}>
        {status}
      </span>
    </span>
  );
}

export const useProjectHeaderItems = (projectType: string) => {
  const { id } = useParams();
  const router = useRouter();
  useProject(id as UUID);
  const { data: projectList } = useProjectList();
  const projectSwitchDialog = useBoolean(false);
  const [pendingProject, setPendingProject] = useState<Project | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const project = useProjectStore((p) => p.singleProject);
  const { data, subData } = useNavData();
  const currentPath = usePathname();

  const projectName = project?.name || '';
  const isCVA = project?.type === 'cva';
  const projects: Project[] = projectList?.data ?? [];

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
      <Badge className="bg-blue-500 text-white rounded-full px-3 py-1">
        {isCVA ? 'CASH VOUCHER ASSITANCE' : projectType}
      </Badge>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger className="ml-2 flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-secondary border rounded-sm">
          <span className="flex flex-col items-start leading-tight">
            <span className="text-[13px] font-bold tracking-tight text-foreground">
              {projectName || 'Select project'}
            </span>
            <span className="mt-1 flex items-center gap-1.5">
              <Badge
                variant="outline"
                className="cursor-auto border-primary/40 bg-secondary px-1.5 py-0 text-[10px] text-primary"
              >
                {(project?.type || '').toUpperCase()}
              </Badge>
              <ProjectStatusDot status={project?.status} />
              {/* <Badge
                variant="outline"
                className="border-primary text-primary cursor-auto bg-secondary"
              >
                {project?.type}
              </Badge>
              <StatusBadge status={project?.status} /> */}
            </span>
          </span>
          <ChevronDown size={16} className="shrink-0 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-80 p-1.5">
          <p className="px-2 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Switch project
          </p>
          {projects.map((p) => {
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
                    {/* <Badge
                      variant="outline"
                      className="cursor-auto border-primary/40 bg-secondary px-1.5 py-0 text-[10px] text-primary"
                    >
                      {(p.type || '').toUpperCase()}
                    </Badge>
                    <ProjectStatusDot status={p?.status} /> */}
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
          {projects.length === 0 && (
            <p className="px-2 py-1.5 text-sm text-muted-foreground">
              No projects found
            </p>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmationDialog
        isConfirmationDialogOpen={projectSwitchDialog.value}
        onCancel={cancelProjectSwitch}
        onConfirm={confirmProjectSwitch}
        dialogTitle="Switch project?"
        dialogMessage={
          pendingProject
            ? `Switch to "${
                pendingProject.name || 'Untitled project'
              }"? Any unsaved changes on this page will be lost.`
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
