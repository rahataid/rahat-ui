'use client';

import { useState } from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { ChevronDown, ChevronRight, Play, Plus, Trash2 } from 'lucide-react';
import { cn } from '@rahat-ui/shadcn/src';
import { IvrFlow, IvrFlowNode } from '../types/ivr.flow.types';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';

const LEVEL_COLORS = [
  {
    name: 'Main',
    bg: 'bg-white',
    selectedBg: 'bg-gray-100',
    hoverBg: 'hover:bg-gray-100',
    border: 'border-gray-100',
    selectedBorder: 'border-gray-300',
  },
  {
    name: 'Level 1',
    bg: 'bg-blue-50',
    selectedBg: 'bg-blue-100',
    hoverBg: 'hover:bg-blue-100',
    border: 'border-blue-100',
    selectedBorder: 'border-blue-300',
  },
  {
    name: 'Level 2',
    bg: 'bg-green-50',
    selectedBg: 'bg-green-100',
    hoverBg: 'hover:bg-green-100',
    border: 'border-green-100',
    selectedBorder: 'border-green-300',
  },
  {
    name: 'Level 3',
    bg: 'bg-purple-50',
    selectedBg: 'bg-purple-100',
    hoverBg: 'hover:bg-purple-100',
    border: 'border-purple-100',
    selectedBorder: 'border-purple-300',
  },
  {
    name: 'Level 4+',
    bg: 'bg-amber-50',
    selectedBg: 'bg-amber-100',
    hoverBg: 'hover:bg-amber-100',
    border: 'border-amber-100',
    selectedBorder: 'border-amber-300',
  },
];

function getLevelColor(level: number, selected: boolean) {
  const c = LEVEL_COLORS[Math.min(level, LEVEL_COLORS.length - 1)];
  return selected
    ? `${c.selectedBg} ${c.selectedBorder}`
    : `${c.bg} ${c.border} ${c.hoverBg}`;
}

interface TreePanelProps {
  flow: IvrFlow;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  onAddNode: (parentId: string) => void;
  onDeleteNode: (id: string) => void;
  onSimulate: () => void;
}

function TreeItem({
  item,
  selectedNodeId,
  onSelectNode,
  onAddNode,
  onDeleteNode,
  level,
}: {
  item: IvrFlowNode;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  onAddNode: (parentId: string) => void;
  onDeleteNode: (id: string) => void;
  level: number;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = item.children.length > 0;
  const isSelected = selectedNodeId === item.id;

  const maxReached = item.children.length >= 9;

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (maxReached) return;
    onAddNode(item.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteNode(item.id);
  };

  return (
    <div className="group">
      <div
        className={cn(
          'flex items-center gap-2 px-2 md:px-4 py-2 md:py-3 mb-2 rounded-sm border transition-colors cursor-pointer',
          getLevelColor(level, isSelected),
        )}
        onClick={() => onSelectNode(item.id)}
        style={{ marginLeft: `${level * 16}px` }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0 h-6 w-6 flex items-center justify-center"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <div className="w-6" />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-medium">
              {level === 0 ? 'Main Menu' : 'Digit'}
            </span>

            {level > 0 && (
              <span className="rounded-full border border-gray-300 bg-gray-100 px-2 py-0.5 text-xs font-semibold">
                {item.label.replace('Digit ', '')}
              </span>
            )}
          </div>{' '}
          <div className="text-xs text-muted-foreground truncate">
            {item.prompt
              ? 'Audio: ' + item.prompt.slice(0, 40) + '...'
              : 'No audio set'}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TooltipWrapper tip="Add child node">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-transparent hover:text-inherit"
              onClick={handleAddChild}
              disabled={maxReached}
              title="Add child"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipWrapper>

          <TooltipWrapper tip="Delete this node">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-transparent hover:text-inherit"
              onClick={handleDelete}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipWrapper>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="ml-5 pl-3 border-l border-blue-200">
          {' '}
          {item.children.map((child) => (
            <TreeItem
              key={child.id}
              item={child}
              selectedNodeId={selectedNodeId}
              onSelectNode={onSelectNode}
              onAddNode={onAddNode}
              onDeleteNode={onDeleteNode}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
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
