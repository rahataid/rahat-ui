'use client';

import { useState } from 'react';
import { IvrFlow, IvrFlowNode } from './ivr.flow.types';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { ChevronDown, ChevronRight, Play, Plus, Trash2 } from 'lucide-react';
import { cn } from '@rahat-ui/shadcn/src';

const LEVEL_COLORS = [
  {
    name: 'Main',
    bg: 'bg-white',
    selectedBg: 'bg-gray-90',
    border: 'border-gray-90',
    selectedBorder: 'border-gray-300',
  },
  {
    name: 'Level 1',
    bg: 'bg-blue-50',
    selectedBg: 'bg-blue-90',
    border: 'border-blue-90',
    selectedBorder: 'border-blue-300',
  },
  {
    name: 'Level 2',
    bg: 'bg-green-50',
    selectedBg: 'bg-green-90',
    border: 'border-green-90',
    selectedBorder: 'border-green-300',
  },
  {
    name: 'Level 3',
    bg: 'bg-purple-50',
    selectedBg: 'bg-purple-90',
    border: 'border-purple-90',
    selectedBorder: 'border-purple-300',
  },
  {
    name: 'Level 4+',
    bg: 'bg-amber-50',
    selectedBg: 'bg-amber-90',
    border: 'border-amber-90',
    selectedBorder: 'border-amber-300',
  },
];

function getLevelColor(level: number, selected: boolean) {
  const c = LEVEL_COLORS[Math.min(level, LEVEL_COLORS.length - 1)];
  return selected
    ? `${c.selectedBg} ${c.selectedBorder}`
    : `${c.bg} ${c.border} hover:${c.selectedBg}`;
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

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddNode(item.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteNode(item.id);
  };

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 px-4 py-3 mb-2 rounded-sm border transition-colors cursor-pointer',
          getLevelColor(level, isSelected),
        )}
        onClick={() => onSelectNode(item.id)}
        style={{ marginLeft: `${level * 20}px` }}
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

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleAddChild}
            title="Add child option"
          >
            <Plus className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:text-destructive"
            onClick={handleDelete}
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
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
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-12">
          <h3 className="text-2xl font-bold whitespace-nowrap">IVR Flow</h3>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-medium">Levels:</span>

            {LEVEL_COLORS.map((lvl) => (
              <div key={lvl.name} className="flex items-center gap-1">
                <span
                  className={cn(
                    'inline-block w-3 h-3 rounded border',
                    lvl.bg,
                    lvl.border,
                  )}
                />
                <span>{lvl.name}</span>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="default"
          className="gap-2 rounded-sm"
          size="sm"
          onClick={onSimulate}
        >
          <Play className="w-4 h-4" />
          Simulate
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Card className="rounded-sm bg-muted/60 boarder-0">
          <CardContent className="p-4">
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
