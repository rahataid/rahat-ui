'use client';

import React from 'react';
import { useState, useCallback } from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { cn } from '@rahat-ui/shadcn/src';
import { IvrFlowNode } from '../types/ivr.flow.types';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import { useTranslations } from 'next-intl';

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

type TreeItemProps = {
  item: IvrFlowNode;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  onAddNode: (parentId: string) => void;
  onDeleteNode: (id: string) => void;
  level: number;
};

function TreeItem({
  item,
  selectedNodeId,
  onSelectNode,
  onAddNode,
  onDeleteNode,
  level,
}: TreeItemProps) {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = item.children.length > 0;
  const isSelected = selectedNodeId === item.id;
  const maxReached = item.children.length >= 9;

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  }, []);

  const handleAddChild = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (maxReached) return;
      onAddNode(item.id);
    },
    [maxReached, onAddNode, item.id],
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDeleteNode(item.id);
    },
    [onDeleteNode, item.id],
  );

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
            onClick={handleToggle}
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
              {level === 0 ? t('MAIN_MENU') : t('DIGIT')}
            </span>
            {level > 0 && (
              <span className="rounded-full border border-gray-300 bg-gray-100 px-2 py-0.5 text-xs font-semibold">
                {item.label.replace('Digit ', '')}
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {item.prompt
              ? `${t('AUDIO')}: ` + item.prompt.slice(0, 40) + '...'
              : t('NO_AUDIO_SET')}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TooltipWrapper tip={t('ADD_CHILD_NODE')}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-transparent hover:text-inherit"
              onClick={handleAddChild}
              disabled={maxReached}
              title={t('ADD_CHILD')}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipWrapper>

          {level > 0 && (
            <TooltipWrapper tip={t('DELETE_THIS_NODE')}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-transparent hover:text-inherit"
                onClick={handleDelete}
                title={tg('DELETE')}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipWrapper>
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="ml-5 pl-3 border-l border-blue-200">
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

export default TreeItem;
