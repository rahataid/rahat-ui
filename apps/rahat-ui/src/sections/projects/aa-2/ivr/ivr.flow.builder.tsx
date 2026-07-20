'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useIvrFlowStore } from './ivr.flow.store';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { ArrowLeft, Settings, Code, Undo2, Redo2 } from 'lucide-react';
import TreePanel from './ivr.tree.panel';
import NodeEditorPanel from './ivr.node.editor';
import JSONPreviewPanel from './ivr.json.preview';
import SimulationModal from './ivr.simulation.modal';

interface FlowBuilderProps {
  ivrId: string;
}

export default function FlowBuilder({ ivrId }: FlowBuilderProps) {
  const router = useRouter();
  const { id } = useParams();

  const flows = useIvrFlowStore((s) => s.flows);
  const loadFlow = useIvrFlowStore((s) => s.loadFlow);
  const addNode = useIvrFlowStore((s) => s.addNode);
  const updateNode = useIvrFlowStore((s) => s.updateNode);
  const deleteNode = useIvrFlowStore((s) => s.deleteNode);
  const undo = useIvrFlowStore((s) => s.undo);
  const redo = useIvrFlowStore((s) => s.redo);
  const canUndo = useIvrFlowStore((s) => s.canUndo);
  const canRedo = useIvrFlowStore((s) => s.canRedo);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);

  const flow = flows.find((f) => f.id === ivrId);

  useEffect(() => {
    loadFlow(ivrId);
    setSelectedNodeId(null);
  }, [ivrId, loadFlow]);

  const handleBack = () => {
    router.push(`/projects/aa/${id}/ivr`);
  };

  const handleAddNode = useCallback(
    (parentId: string) => {
      addNode(parentId, {});
    },
    [addNode],
  );

  const handleUpdateNode = useCallback(
    (nodeId: string, updates: any) => {
      updateNode(nodeId, updates);
    },
    [updateNode],
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      deleteNode(nodeId);
      if (selectedNodeId === nodeId) setSelectedNodeId(null);
    },
    [deleteNode, selectedNodeId],
  );

  if (!flow) {
    return (
      <div className="h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">IVR flow not found</p>
          <Button variant="outline" className="mt-4" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to IVR list
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">{flow.name}</h1>
              <p className="text-sm text-muted-foreground">
                {flow.description || 'IVR Flow Builder'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={undo}
              disabled={!canUndo()}
              title="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={redo}
              disabled={!canRedo()}
              title="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </Button>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden gap-4 p-4 bg-muted/50">
        {/* Left - Tree Panel */}
        <div className="w-1/2 bg-white rounded-sm border overflow-hidden flex flex-col">
          <TreePanel
            flow={flow}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            onAddNode={handleAddNode}
            onDeleteNode={handleDeleteNode}
            onSimulate={() => setIsSimulationOpen(true)}
          />
        </div>

        {/* Right - Editor + JSON Preview */}
        <div className="w-1/2 bg-white rounded-sm border overflow-hidden flex flex-col">
          <Tabs defaultValue="editor" className="flex flex-col h-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-muted/50 p-0">
              <TabsTrigger
                value="editor"
                className="gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-foreground"
              >
                <Settings className="w-4 h-4" />
                Node Editor
              </TabsTrigger>
              <TabsTrigger
                value="json"
                className="gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-foreground"
              >
                <Code className="w-4 h-4" />
                JSON Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="flex-1 overflow-y-auto m-0 p-0">
              {selectedNodeId ? (
                <NodeEditorPanel
                  flow={flow}
                  selectedNodeId={selectedNodeId}
                  onUpdateNode={handleUpdateNode}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Select a menu item from the tree to edit
                </div>
              )}
            </TabsContent>

            <TabsContent value="json" className="flex-1 overflow-hidden m-0 p-0">
              <JSONPreviewPanel flow={flow} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Simulation Modal */}
      {isSimulationOpen && (
        <SimulationModal
          flow={flow}
          onClose={() => setIsSimulationOpen(false)}
        />
      )}
    </div>
  );
}
