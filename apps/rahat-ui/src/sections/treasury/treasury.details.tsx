'use client';
import { Avatar } from '@rahat-ui/shadcn/src/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { ArrowUp } from 'lucide-react';
import TreasuryCard from './treasury.card';
import { useProjectList } from '@rahat-ui/query';

const TreasuryDetails = () => {
  const projects = useProjectList();
  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-8">
        <div className="bg-card h-[calc(100vh-175px)] rounded-md p-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-700 text-xl font-medium">Projects</p>
            <Input
              className="w-1/2"
              type="text"
              placeholder="Search Projects"
            />
          </div>
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {projects?.data?.data.map((project, index) => (
                <TreasuryCard
                  key={index}
                  projectName={project?.name}
                  projectAddress={
                    project?.contractAddress
                      ? (project?.contractAddress as `0x${string}`)
                      : '0xa'
                  }
                />
              ))}
            </div>
            {/* <div className="flex items-center justify-around">
              <TreasuryCard
                projectName={'Jaleshwor Project'}
                projectBudget={'100'}
              />
              <TreasuryCard
                projectName={'Jaleshwor Project'}
                projectBudget={'50'}
              />
            </div> */}
          </div>
        </div>
      </div>
      <div className="col-span-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-neutral-800 font-medium">
              Recent Deposits
            </CardTitle>
          </CardHeader>
          <ScrollArea className="h-[700px]">
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                >
                  <ArrowUp size={20} strokeWidth={1.25} />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default TreasuryDetails;
