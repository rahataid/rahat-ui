'use client';

import { useState } from 'react';
import { IvrFlow, IvrFlowNode } from './ivr.flow.types';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ChevronDown, ChevronRight, Play, Plus, Trash2 } from 'lucide-react';
import { cn } from '@rahat-ui/shadcn/src';

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
          'px-4 py-3 flex items-center gap-2 hover:bg-muted/50 cursor-pointer rounded-lg border mb-1',
          isSelected
            ? 'bg-muted/80 border-foreground/20'
            : 'border-transparent',
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
          <div className="text-sm font-semibold">{item.label}</div>
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
        <div className="ml-4 border-l border-border pl-2">
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
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-bold">Menu Structure</h3>
        <Button
          className="gap-2 bg-green-600 hover:bg-green-700"
          size="sm"
          onClick={onSimulate}
        >
          <Play className="w-4 h-4" />
          Simulate
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
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
      </div>
    </div>
  );
}
