'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useIvrFlowStore } from './ivr.flow.store';
import { useIvrTemplateDetail } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { ArrowLeft, Settings, Code, Download, Loader2 } from 'lucide-react';
import TreePanel from './ivr.tree.panel';
import NodeEditorPanel from './ivr.node.editor';
import JSONPreviewPanel from './ivr.json.preview';
import SimulationModal from './ivr.simulation.modal';
import ExportModal from './ivr.export.modal';
import {
  IvrFlowNode,
  IvrFlowApiPayload,
  IvrFlowOption,
  IvrFlow,
} from './ivr.flow.types';

function convertApiPayloadToNode(payload: IvrFlowApiPayload): IvrFlowNode {
  function mapOptions(options: IvrFlowOption[]): IvrFlowNode[] {
    return (options || []).map((opt) => ({
      id: `node_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      digit: String(opt.digit),
      label: opt.digit ? `Digit ${opt.digit}` : 'Menu',
      prompt: opt.prompt || '',
      hangup: opt.hangup || false,
      destination: opt.destination || '',
      children: mapOptions(opt.options || []),
    }));
  }

  return {
    id: `node_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    label: 'Main Menu',
    prompt: payload.main?.prompt || '',
    hangup: false,
    destination: '',
    children: mapOptions(payload.main?.options || []),
  };
}

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
  const setFlowRootMenu = useIvrFlowStore((s) => s.setFlowRootMenu);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const populatedRef = useRef(false);

  const flow = flows.find((f) => f.id === ivrId);

  const { data: templateDetail } = useIvrTemplateDetail(Number(ivrId));
  const [isFetchingFlow, setIsFetchingFlow] = useState(
    !!templateDetail?.flowUrl,
  );

  const flowJsonString = useMemo(() => {
    if (!flow) return '';
    const mapNode = (
      node: IvrFlowNode,
    ): IvrFlowApiPayload['main']['options'][number] => ({
      digit: parseInt(node.digit || '0') || 0,
      destination: node.destination || '',
      prompt: node.prompt || '',
      hangup: node.hangup || false,
      options: (node.children || []).map(mapNode),
    });
    const payload: IvrFlowApiPayload = {
      main: {
        prompt: flow.rootMenu.prompt || '',
        options: (flow.rootMenu.children || []).map(mapNode),
      },
    };
    return JSON.stringify(payload, null, 2);
  }, [flow]);

  useEffect(() => {
    populatedRef.current = false;
    loadFlow(ivrId);
    setSelectedNodeId(null);
  }, [ivrId, loadFlow]);

  useEffect(() => {
    if (!templateDetail?.flowUrl || populatedRef.current) return;

    const fetchAndPopulate = async () => {
      setIsFetchingFlow(true);
      try {
        const response = await fetch(templateDetail.flowUrl);
        if (!response.ok) throw new Error('Failed to fetch flow data');
        const data: IvrFlowApiPayload = await response.json();
        const rootMenu = convertApiPayloadToNode(data);
        setFlowRootMenu(ivrId, rootMenu);
      } catch (err) {
        console.error('Failed to load IVR flow from URL:', err);
      }
      populatedRef.current = true;
      setIsFetchingFlow(false);
    };

    fetchAndPopulate();
  }, [templateDetail, ivrId, setFlowRootMenu]);

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

  const displayName = templateDetail?.name || flow.name;
  const displayDescription =
    templateDetail?.description || flow.description || 'IVR Flow Builder';

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
              <h1 className="text-xl font-bold">{displayName}</h1>
              <p className="text-sm text-muted-foreground">
                {displayDescription}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-sm"
            onClick={() => setIsExportOpen(true)}
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden gap-4 p-4 bg-muted/50">
        {/* Left - Tree Panel */}
        <div className="w-1/2 bg-white rounded-sm border overflow-hidden flex flex-col relative">
          {isFetchingFlow && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Loading flow data...
                </span>
              </div>
            </div>
          )}
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
            <div className="px-4 pt-3">
              <TabsList className="border bg-secondary rounded w-full">
                <TabsTrigger
                  value="editor"
                  className="w-full gap-2 data-[state=active]:bg-white"
                >
                  <Settings className="w-4 h-4" />
                  Node Editor
                </TabsTrigger>
                <TabsTrigger
                  value="json"
                  className="w-full gap-2 data-[state=active]:bg-white"
                >
                  <Code className="w-4 h-4" />
                  JSON Preview
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="editor"
              className="flex-1 overflow-y-auto m-0 p-0"
            >
              {selectedNodeId ? (
                <NodeEditorPanel
                  flow={flow}
                  selectedNodeId={selectedNodeId}
                  onUpdateNode={handleUpdateNode}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Settings className="w-6 h-6 text-muted-foreground/60" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">No Node Selected</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Select a menu item from the tree to edit its properties
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="json"
              className="flex-1 overflow-hidden m-0 p-0"
            >
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

      {/* Export Modal */}
      <ExportModal
        open={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        ivrId={Number(ivrId)}
        jsonContent={flowJsonString}
        onExported={() => {
          populatedRef.current = false;
        }}
      />
    </div>
  );
}
