import React, { useState } from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@rahat-ui/shadcn/src/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import { useParams } from 'next/navigation';
import { useActivityTemplates } from '@rahat-ui/query/lib/aa/activities/activities.service';
import { UUID } from 'crypto';
import { Filter, ChevronRight, Zap, Wrench, Eye } from 'lucide-react';
import {
  AUTOMATION_TYPE,
  PHASE,
} from 'apps/rahat-ui/src/constants/aa.constants';
import { useDebounce, usePagination } from '@rahat-ui/query';
import { Template } from 'apps/rahat-ui/src/types/activities';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@rahat-ui/shadcn/src/components/ui/accordion';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import { TemplateDetailsDialog } from './templateDetailsDialog';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';
interface ViewTemplateProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelectTemplate?: (template: Template) => void;
}

const ViewTemplate = ({
  open,
  setOpen,
  onSelectTemplate,
}: ViewTemplateProps) => {
  const { id }: { id: UUID } = useParams();
  const { pagination, filters, setNextPage, setPrevPage, setFilters } =
    usePagination();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );

  const debouncedTitleSearch = useDebounce(filters.title || '', 500);
  const debouncedCategorySearch = useDebounce(filters.category || '', 500);

  const { data: templates, isLoading } = useActivityTemplates(id, {
    page: pagination.page,
    perPage: pagination.perPage,
    phase: filters.phase,
    category: debouncedCategorySearch,
    title: debouncedTitleSearch,
    isAutomated:
      filters.isAutomated === 'true'
        ? 'true'
        : filters.isAutomated === 'false'
        ? 'false'
        : '',
    hasCommunication: filters.hasCommunication === 'true' ? 'true' : '',
  });

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-[600px] sm:w-[700px] overflow-y-auto">
          <SheetHeader className="pb-4 border-b">
            <SheetTitle className="text-2xl">Available Templates</SheetTitle>
            <SheetDescription className="text-base">
              Discover and filter activity templates for your workflow
            </SheetDescription>
          </SheetHeader>

          {/* Filter Section */}
          <div className="mt-2 space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="filters" className="border-b">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">
                      Filters
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 gap-3">
                    {/* Phase */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phase</label>
                      <Select
                        value={filters.phase === '' ? 'all' : filters.phase}
                        onValueChange={(value) =>
                          setFilters((prev: Template) => ({
                            ...prev,
                            phase: value === 'all' ? '' : value,
                            page: 1,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring">
                          <SelectValue placeholder="Select phase" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Phase</SelectLabel>
                            {PHASE.map((s) => (
                              <SelectItem key={s.value} value={s.value}>
                                {s.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Input
                        placeholder="Search category..."
                        value={filters.category}
                        onChange={(e) =>
                          setFilters((prev: Template) => ({
                            ...prev,
                            category: e.target.value,
                            page: 1,
                          }))
                        }
                        className="border-input"
                      />
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        placeholder="Search by title..."
                        value={filters.title}
                        onChange={(e) =>
                          setFilters((prev: Template) => ({
                            ...prev,
                            title: e.target.value,
                            page: 1,
                          }))
                        }
                        className="border-input"
                      />
                    </div>

                    {/* Automated */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Type</label>
                      <Select
                        value={
                          filters.isAutomated === ''
                            ? 'all'
                            : filters.isAutomated?.toString()
                        }
                        onValueChange={(value) =>
                          setFilters((prev: Template) => ({
                            ...prev,
                            isAutomated:
                              value === 'all'
                                ? ''
                                : value === 'true'
                                ? 'true'
                                : 'false',
                            page: 1,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Type</SelectLabel>
                            {AUTOMATION_TYPE.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Has Communication  switch*/}
                    <div className=" flex justify-between items-center space-y-2">
                      <label className="text-sm font-medium ">
                        Has Communication
                      </label>
                      <div className="flex items-center gap-2">
                        <label>No</label>
                        <Switch
                          checked={filters.hasCommunication === 'true'}
                          onCheckedChange={(value) =>
                            setFilters((prev: Template) => ({
                              ...prev,
                              hasCommunication: value ? 'true' : 'false',
                              page: 1,
                            }))
                          }
                        />
                        <label>Yes</label>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Template List */}
          <div className="mt-8 space-y-3">
            {isLoading && (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))}
              </div>
            )}

            {!isLoading && templates?.data?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Filter className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-foreground">
                  No templates found
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your filters
                </p>
              </div>
            )}

            {templates?.data?.map((item: Template) => (
              <div
                key={item.uuid}
                className="group border border-border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all duration-200 bg-card hover:bg-muted/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base text-foreground truncate group-hover:text-primary transition-colors">
                      <TruncatedCell
                        text={item.title}
                        maxLength={50}
                        className="max-w-[350px] text-wrap"
                      />
                    </h3>

                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      <TruncatedCell
                        text={item.description}
                        maxLength={45}
                        className="max-w-[350px] text-wrap"
                      />
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.phase?.name && (
                        <Badge variant="secondary" className="text-xs">
                          {item.phase.name}
                        </Badge>
                      )}
                      {item.category?.name && (
                        <Badge variant="outline" className="text-xs">
                          {item.category.name}
                        </Badge>
                      )}
                      <Badge
                        variant={item.isAutomated ? 'default' : 'secondary'}
                        className="text-xs flex items-center gap-1"
                      >
                        {item.isAutomated ? (
                          <>
                            <Zap className="w-3 h-3" />
                            Automated
                          </>
                        ) : (
                          <>
                            <Wrench className="w-3 h-3" />
                            Manual
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    className="w-full mt-4 gap-2"
                    onClick={() => {
                      setSelectedTemplate(item);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onSelectTemplate?.(item);
                    }}
                    className="w-full mt-4 gap-2"
                  >
                    Choose Template
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {templates?.meta && (
            <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t">
              <Button
                variant="outline"
                size="sm"
                disabled={!templates.meta.prev}
                onClick={() => setPrevPage()}
                className="flex-1"
              >
                ← Previous
              </Button>

              <div className="px-4 py-2 rounded-md bg-muted text-center flex-1">
                <span className="text-sm font-medium">
                  Page {templates.meta.currentPage} of {templates.meta.lastPage}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={!templates.meta.next}
                onClick={() => setNextPage()}
                className="flex-1"
              >
                Next →
              </Button>
            </div>
          )}

          <SheetFooter className="mt-8 gap-2">
            <SheetClose asChild>
              <Button variant="outline" className="flex-1">
                Close
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View Details dialog */}
      <TemplateDetailsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        template={selectedTemplate}
        onSelectTemplate={onSelectTemplate}
        setOpen={setOpen}
      />
    </>
  );
};

export default ViewTemplate;
