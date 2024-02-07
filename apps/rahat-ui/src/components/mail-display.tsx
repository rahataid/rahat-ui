"use client";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@radix-ui/react-tooltip";
import {
  Archive,
  ArchiveX,
  Clock,
  Forward,
  MoreVertical,
  Reply,
  ReplyAll,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Label,
  Separator,
} from "@radix-ui/react-dropdown-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { Calendar } from "./ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "./ui/textarea";
import { Switch } from "@radix-ui/react-switch";
import { Mail } from "@/app/examples/mail/data";

export function MailDisplay() {
  const today = new Date();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Archive className="h-4 w-4" />
                  <span className="sr-only">Archive</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Archive</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ArchiveX className="h-4 w-4" />
                  <span className="sr-only">Move to junk</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Move to junk</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Move to trash</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Move to trash</TooltipContent>
            </Tooltip>
            <Separator className="mx-1 h-6" />
            <Tooltip>
              <Popover>
                <PopoverTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Clock className="h-4 w-4" />
                      <span className="sr-only">Snooze</span>
                    </Button>
                  </TooltipTrigger>
                </PopoverTrigger>
                <PopoverContent className="flex w-[535px] p-0">
                  <div className="flex flex-col gap-2 border-r px-2 py-4">
                    <div className="px-4 text-sm font-medium">Snooze until</div>
                    <div className="grid min-w-[250px] gap-1">
                      <Button
                        variant="ghost"
                        className="justify-start font-normal"
                      >
                        Later today{" "}
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start font-normal"
                      >
                        Tomorrow
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start font-normal"
                      >
                        This weekend
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start font-normal"
                      >
                        Next week
                      </Button>
                    </div>
                  </div>
                  <div className="p-2">
                    <Calendar />
                  </div>
                </PopoverContent>
              </Popover>
              <TooltipContent>Snooze</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Reply className="h-4 w-4" />
                  <span className="sr-only">Reply</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reply</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ReplyAll className="h-4 w-4" />
                  <span className="sr-only">Reply all</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reply all</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Forward className="h-4 w-4" />
                  <span className="sr-only">Forward</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Forward</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Separator className="mx-2 h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Mark as unread</DropdownMenuItem>
            <DropdownMenuItem>Star thread</DropdownMenuItem>
            <DropdownMenuItem>Add label</DropdownMenuItem>
            <DropdownMenuItem>Mute thread</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      <div className="flex flex-1 flex-col">
        <div className="flex items-start p-4">
          <div className="flex items-start gap-4 text-sm">
            <Avatar></Avatar>
            <div className="grid gap-1">
              <div className="font-semibold">Name</div>
              <div className="line-clamp-1 text-xs">subject</div>
              <div className="line-clamp-1 text-xs">
                <span className="font-medium">Reply-To:</span> email
              </div>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex-1 whitespace-pre-wrap p-4 text-sm">text</div>
        <Separator className="mt-auto" />
        <div className="p-4">
          <form>
            <div className="grid gap-4">
              <Textarea className="p-4" placeholder={`.....`} />
              <div className="flex items-center">
                <Label className="flex items-center gap-2 text-xs font-normal">
                  <Switch id="mute" aria-label="Mute thread" /> Mute this thread
                </Label>
                <Button
                  onClick={(e) => e.preventDefault()}
                  size="sm"
                  className="ml-auto"
                >
                  Send
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
