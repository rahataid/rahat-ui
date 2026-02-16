import React, { useState } from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@rahat-ui/shadcn/src/components/ui/sheet';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { useParams } from 'next/navigation';
import { useActivityTemplates } from '@rahat-ui/query/lib/aa/activities/activities.service';
import { UUID } from 'crypto';

interface ViewTemplateProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ViewTemplate = ({ open, setOpen }: ViewTemplateProps) => {
  const { id }: { id: UUID } = useParams();
  const [filters, setFilters] = useState<{
    page: number;
    perPage: number;
    phase: string;
    category: string;
    title: string;
    isAutomated: boolean | undefined;
  }>({
    page: 1,
    perPage: 50,
    phase: '',
    category: '',
    title: '',
    isAutomated: undefined,
  });

  const { data: templates, isLoading } = useActivityTemplates(id, filters);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">View Template</Button>
      </SheetTrigger>

      <SheetContent className="w-[600px] sm:w-[700px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Available Templates</SheetTitle>
          <SheetDescription>
            Filter and view available activity templates.
          </SheetDescription>
        </SheetHeader>

        {/* ================= FILTER SECTION ================= */}
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            {/* Phase */}
            <select
              value={filters.phase}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  phase: e.target.value,
                  page: 1,
                }))
              }
              className="border p-2 rounded-md text-sm"
            >
              <option value="">All Phases</option>
              <option value="Preparedness">Preparedness</option>
              <option value="Readiness">Readiness</option>
              <option value="Activation">Activation</option>
            </select>

            {/* Category */}
            <Input
              placeholder="Category"
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  category: e.target.value,
                  page: 1,
                }))
              }
            />

            {/* Title */}
            <Input
              placeholder="Search by title"
              value={filters.title}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  title: e.target.value,
                  page: 1,
                }))
              }
            />

            {/* Automated */}
            <select
              value={
                filters.isAutomated === undefined
                  ? ''
                  : filters.isAutomated.toString()
              }
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  isAutomated:
                    e.target.value === ''
                      ? undefined
                      : e.target.value === 'true',
                  page: 1,
                }))
              }
              className="border p-2 rounded-md text-sm"
            >
              <option value="">All Types</option>
              <option value="true">Automated</option>
              <option value="false">Manual</option>
            </select>
          </div>
        </div>

        {/* ================= TEMPLATE LIST ================= */}
        <div className="mt-6 space-y-4">
          {isLoading && <p>Loading templates...</p>}

          {templates?.data?.length === 0 && (
            <p className="text-sm text-muted-foreground">No templates found.</p>
          )}

          {templates?.data?.map((item: any) => (
            <div
              key={item.uuid}
              className="border rounded-lg p-4 hover:shadow-sm transition"
            >
              <h3 className="font-semibold">{item.title}</h3>

              <p className="text-sm text-muted-foreground mt-1">
                {item.description}
              </p>

              <div className="flex gap-6 mt-2 text-xs text-muted-foreground">
                <span>Phase: {item.phase?.name}</span>
                <span>Category: {item.category?.name}</span>
                <span>{item.isAutomated ? 'Automated' : 'Manual'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ================= PAGINATION ================= */}
        {templates?.meta && (
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              disabled={!templates.meta.prev}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: (prev.page || 1) - 1,
                }))
              }
            >
              Prev
            </Button>

            <span className="text-sm">
              Page {templates.meta.currentPage} of {templates.meta.lastPage}
            </span>

            <Button
              variant="outline"
              disabled={!templates.meta.next}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: (prev.page || 1) + 1,
                }))
              }
            >
              Next
            </Button>
          </div>
        )}

        <SheetFooter className="mt-8">
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ViewTemplate;
