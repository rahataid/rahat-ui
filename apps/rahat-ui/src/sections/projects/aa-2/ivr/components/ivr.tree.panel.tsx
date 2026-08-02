'use client';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { Play } from 'lucide-react';
import { cn } from '@rahat-ui/shadcn/src';
import { IvrFlow } from '../types/ivr.flow.types';
import TreeItem from './ivr.tree.item';

const LEVEL_COLORS = [
  {
    name: 'Main',
    selectedBg: 'bg-gray-100',
    selectedBorder: 'border-gray-300',
  },
  {
    name: 'Level 1',
    selectedBg: 'bg-blue-100',
    selectedBorder: 'border-blue-300',
  },
  {
    name: 'Level 2',
    selectedBg: 'bg-green-100',
    selectedBorder: 'border-green-300',
  },
  {
    name: 'Level 3',
    selectedBg: 'bg-purple-100',
    selectedBorder: 'border-purple-300',
  },
  {
    name: 'Level 4+',
    selectedBg: 'bg-amber-100',
    selectedBorder: 'border-amber-300',
  },
];

interface TreePanelProps {
  flow: IvrFlow;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  onAddNode: (parentId: string) => void;
  onDeleteNode: (id: string) => void;
  onSimulate: () => void;
}

export default function TreePanel({
  flow,
  selectedNodeId,
  onSelectNode,
  onAddNode,
  onDeleteNode,
  onSimulate,
}: TreePanelProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 px-3 md:px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
          <h3 className="text-[clamp(18px,2vw,24px)] font-bold">IVR Flow</h3>
          <div className="flex items-center gap-2 md:gap-3 text-[clamp(10px,0.9vw,12px)] text-muted-foreground flex-wrap">
            <span className="font-medium">Levels:</span>
            {LEVEL_COLORS.map((lvl) => (
              <div key={lvl.name} className="flex items-center gap-1">
                <span
                  className={cn(
                    'inline-block w-2.5 h-2.5 md:w-3 md:h-3 rounded border',
                    lvl.selectedBg,
                    lvl.selectedBorder,
                  )}
                />
                <span className="hidden sm:inline">{lvl.name}</span>
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="default"
          className="gap-2 rounded-sm h-[clamp(28px,2.5vw,36px)] text-[clamp(12px,1vw,14px)]"
          size="sm"
          onClick={onSimulate}
        >
          <Play className="w-4 h-4" />
          Simulate
        </Button>
      </div>

      <div className="flex-1 p-4 min-h-0">
        <Card className="rounded-sm bg-muted/60 boarder-0 h-full">
          <CardContent className="p-4 h-full overflow-y-auto">
            <div className="group">
              <TreeItem
                item={flow.rootMenu}
                selectedNodeId={selectedNodeId}
                onSelectNode={onSelectNode}
                onAddNode={onAddNode}
                onDeleteNode={onDeleteNode}
                level={0}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
