import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { FileText, Mail, Clock, User } from 'lucide-react';

interface TemplateDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: any;
}

export function TemplateDetailsDialog({
  open,
  onOpenChange,
  template,
}: TemplateDetailsDialogProps) {
  if (!template) return null;

  const isCompleted = template.status === 'COMPLETED';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-4 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-semibold flex items-center justify-between">
            {template.title}
            <Badge variant="secondary">{template.status}</Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] px-6 pb-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <InfoItem icon={<Clock size={16} />} label="Lead Time">
              {template.leadTime || '—'}
            </InfoItem>

            <InfoItem icon={<User size={16} />} label="Manager">
              {template.manager?.name}
              <div className="text-xs text-muted-foreground">
                {template.manager?.email}
              </div>
            </InfoItem>

            <InfoItem label="Phase">{template.phase?.name}</InfoItem>

            <InfoItem label="Category">{template.category?.name}</InfoItem>
          </div>

          <Separator className="my-6" />

          {/* Description */}
          {template.description && (
            <Section title="Description">
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
            </Section>
          )}

          {/* Notes */}
          {template.notes && (
            <Section title="Notes">
              <p className="text-sm text-muted-foreground">{template.notes}</p>
            </Section>
          )}

          {/* Automation */}
          <Section title="Automation">
            <Badge variant={template.isAutomated ? 'default' : 'outline'}>
              {template.isAutomated ? 'Automated' : 'Manual'}
            </Badge>
          </Section>

          {/* Documents */}
          {template.activityDocuments?.length > 0 && (
            <Section title="Documents">
              <div className="space-y-2">
                {template.activityDocuments.map((doc: any, index: number) => (
                  <a
                    key={index}
                    href={doc.mediaURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 border rounded-md hover:bg-muted transition"
                  >
                    <FileText size={16} />
                    <span className="text-sm">{doc.fileName}</span>
                  </a>
                ))}
              </div>
            </Section>
          )}

          {/* Communications */}
          {template.activityCommunication?.length > 0 && (
            <Section title="Communications">
              <div className="space-y-3">
                {template.activityCommunication.map(
                  (comm: any, index: number) => (
                    <div
                      key={index}
                      className="border rounded-lg p-3 bg-muted/40"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">
                          {comm.communicationTitle}
                        </span>
                        <Badge variant="outline">{comm.groupType}</Badge>
                      </div>

                      {typeof comm.message === 'string' ? (
                        <p className="text-sm text-muted-foreground">
                          {comm.message}
                        </p>
                      ) : (
                        <a
                          href={comm.message?.mediaURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 underline"
                        >
                          {comm.message?.fileName}
                        </a>
                      )}
                    </div>
                  ),
                )}
              </div>
            </Section>
          )}

          {/* Completed Info */}
          {isCompleted && (
            <>
              <Separator className="my-6" />
              <Section title="Completion Details">
                <p className="text-sm">
                  Completed By: <strong>{template.completedBy}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Completed At:{' '}
                  {new Date(template.completedAt).toLocaleString()}
                </p>
              </Section>
            </>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}

function InfoItem({
  icon,
  label,
  children,
}: {
  icon?: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-2">
      {icon}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="text-sm font-medium">{children}</div>
      </div>
    </div>
  );
}

// import React from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from '@rahat-ui/shadcn/src/components/ui/dialog';
// import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
// import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
// import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
// import {
//   FileText,
//   MessageSquare,
//   User,
//   Zap,
//   Wrench,
//   Tag,
//   MessageCircle,
//   Music,
//   File,
// } from 'lucide-react';

// interface DialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   template: any;
// }

// const TemplateDetailsDialog = ({
//   open,
//   onOpenChange,
//   template,
// }: DialogProps) => {
//   if (!template) return null;

//   // Helper function to get communication type details
//   const getCommunicationTypeDetails = (type: string) => {
//     const types: Record<
//       string,
//       { icon: React.ReactNode; color: string; bg: string; label: string }
//     > = {
//       SMS: {
//         icon: <MessageCircle className="w-4 h-4" />,
//         color: 'text-blue-600',
//         bg: 'bg-blue-50 dark:bg-blue-950',
//         label: 'SMS',
//       },
//       AUDIO: {
//         icon: <Music className="w-4 h-4" />,
//         color: 'text-purple-600',
//         bg: 'bg-purple-50 dark:bg-purple-950',
//         label: 'Audio',
//       },
//       FILE: {
//         icon: <File className="w-4 h-4" />,
//         color: 'text-orange-600',
//         bg: 'bg-orange-50 dark:bg-orange-950',
//         label: 'File',
//       },
//     };
//     return types[type] || types.SMS;
//   };

//   // Filter communications by type - only SMS, AUDIO, FILE
//   const communicationsByType: Record<string, any[]> = {};
//   if (
//     template.activityCommunication &&
//     Array.isArray(template.activityCommunication)
//   ) {
//     template.activityCommunication.forEach((comm: any) => {
//       const groupType = comm.groupType || 'SMS';
//       if (['SMS', 'AUDIO', 'FILE'].includes(groupType)) {
//         if (!communicationsByType[groupType]) {
//           communicationsByType[groupType] = [];
//         }
//         communicationsByType[groupType].push(comm);
//       }
//     });
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[800px] sm:max-h-[85vh] overflow-hidden flex flex-col">
//         <DialogHeader className="pb-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 -m-6 mb-4 px-6 py-4">
//           <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             {template.title}
//           </DialogTitle>
//           <DialogDescription className="text-base mt-2">
//             {template.description}
//           </DialogDescription>
//         </DialogHeader>

//         <ScrollArea className="flex-1 pr-4">
//           <div className="space-y-4">
//             {/* ================= BASIC INFO ================= */}
//             <div className="space-y-2">
//               <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
//                 <Tag className="w-4 h-4 text-blue-600" />
//                 Basic Info
//               </h3>
//               <div className="grid grid-cols-2 gap-3 pl-6 border-l-4 border-blue-200">
//                 <div>
//                   <p className="text-xs text-muted-foreground font-semibold mb-1">
//                     Status
//                   </p>
//                   <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 text-xs">
//                     {template.status || 'N/A'}
//                   </Badge>
//                 </div>
//                 <div>
//                   <p className="text-xs text-muted-foreground font-semibold mb-1">
//                     Type
//                   </p>
//                   <Badge
//                     className={`text-xs ${
//                       template.isAutomated
//                         ? 'bg-green-100 text-green-800 dark:bg-green-900'
//                         : 'bg-orange-100 text-orange-800 dark:bg-orange-900'
//                     }`}
//                   >
//                     {template.isAutomated ? (
//                       <Zap className="w-3 h-3 mr-1 inline" />
//                     ) : (
//                       <Wrench className="w-3 h-3 mr-1 inline" />
//                     )}
//                     {template.isAutomated ? 'Auto' : 'Manual'}
//                   </Badge>
//                 </div>
//               </div>
//             </div>

//             <Separator className="bg-blue-100 my-2" />

//             {/* ================= PHASE & CATEGORY ================= */}
//             <div className="space-y-2">
//               <h3 className="font-bold text-sm text-foreground">
//                 Classification
//               </h3>
//               <div className="grid grid-cols-2 gap-3 pl-6 border-l-4 border-purple-200">
//                 {template.phase && (
//                   <div>
//                     <p className="text-xs text-muted-foreground font-semibold mb-1">
//                       Phase
//                     </p>
//                     <Badge
//                       variant="outline"
//                       className="text-xs border-purple-300 text-purple-700 dark:border-purple-500 bg-purple-50 dark:bg-purple-950"
//                     >
//                       {template.phase.name}
//                     </Badge>
//                   </div>
//                 )}
//                 {template.category && (
//                   <div>
//                     <p className="text-xs text-muted-foreground font-semibold mb-1">
//                       Category
//                     </p>
//                     <Badge
//                       variant="outline"
//                       className="text-xs border-indigo-300 text-indigo-700 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
//                     >
//                       {template.category.name}
//                     </Badge>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <Separator className="bg-purple-100 my-2" />

//             {/* ================= MANAGER INFO ================= */}
//             {template.manager && (
//               <>
//                 <div className="space-y-2">
//                   <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
//                     <User className="w-4 h-4 text-cyan-600" />
//                     Manager
//                   </h3>
//                   <div className="pl-6 border-l-4 border-cyan-200 bg-cyan-50 dark:bg-cyan-950 rounded-r p-3">
//                     <p className="text-xs">
//                       <span className="text-muted-foreground font-semibold">
//                         Name:{' '}
//                       </span>
//                       <span className="font-bold text-foreground">
//                         {template.manager.name}
//                       </span>
//                     </p>
//                     <p className="text-xs mt-1">
//                       <span className="text-muted-foreground font-semibold">
//                         Email:{' '}
//                       </span>
//                       <span className="font-medium text-cyan-600 dark:text-cyan-400">
//                         {template.manager.email}
//                       </span>
//                     </p>
//                   </div>
//                 </div>

//                 <Separator className="bg-cyan-100 my-2" />
//               </>
//             )}

//             {/* ================= NOTES ================= */}
//             {template.notes && (
//               <>
//                 <div className="space-y-2">
//                   <h3 className="font-bold text-sm text-foreground">Notes</h3>
//                   <p className="pl-6 text-xs text-foreground bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded p-3 border-l-4 border-amber-300 leading-relaxed">
//                     {template.notes}
//                   </p>
//                 </div>

//                 <Separator className="bg-amber-100 my-2" />
//               </>
//             )}

//             {/* ================= DOCUMENTS ================= */}
//             {template.activityDocuments &&
//               template.activityDocuments.length > 0 && (
//                 <>
//                   <div className="space-y-2">
//                     <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
//                       <FileText className="w-4 h-4 text-red-600" />
//                       Documents ({template.activityDocuments.length})
//                     </h3>
//                     <div className="pl-6 space-y-2 border-l-4 border-red-200">
//                       {template.activityDocuments.map(
//                         (doc: any, index: number) => (
//                           <div
//                             key={index}
//                             className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950 rounded text-xs border border-red-200 dark:border-red-800"
//                           >
//                             <FileText className="w-4 h-4 text-red-600 flex-shrink-0" />
//                             <span className="font-semibold text-foreground truncate">
//                               {doc.fileName}
//                             </span>
//                           </div>
//                         ),
//                       )}
//                     </div>
//                   </div>

//                   <Separator className="bg-red-100 my-2" />
//                 </>
//               )}

//             {/* ================= COMMUNICATIONS ================= */}
//             {Object.keys(communicationsByType).length > 0 && (
//               <div className="space-y-3">
//                 <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
//                   <MessageSquare className="w-4 h-4 text-indigo-600" />
//                   Communications (
//                   {Object.values(communicationsByType).flat().length})
//                 </h3>

//                 {Object.entries(communicationsByType).map(
//                   ([commType, comms]) => {
//                     const typeDetails = getCommunicationTypeDetails(commType);
//                     return (
//                       <div
//                         key={commType}
//                         className="space-y-2 pl-6 border-l-4 border-indigo-200"
//                       >
//                         <div className="flex items-center gap-2">
//                           <div className={`p-1 rounded ${typeDetails.bg}`}>
//                             <div className={typeDetails.color}>
//                               {typeDetails.icon}
//                             </div>
//                           </div>
//                           <span className="font-bold text-xs text-foreground">
//                             {typeDetails.label} ({comms.length})
//                           </span>
//                         </div>

//                         {comms.map((comm: any, index: number) => (
//                           <div
//                             key={index}
//                             className={`rounded p-3 space-y-2 text-xs border ${typeDetails.bg} border-current border-opacity-30`}
//                           >
//                             <div className="flex items-start gap-2">
//                               <h4 className="font-bold text-foreground truncate flex-1">
//                                 {comm.communicationTitle ||
//                                   `${typeDetails.label} Message`}
//                               </h4>
//                             </div>

//                             {/* Message Content */}
//                             {typeof comm.message === 'string' &&
//                               comm.message && (
//                                 <p className="text-foreground bg-white dark:bg-slate-950 rounded p-2 border border-gray-200 dark:border-gray-800 line-clamp-3">
//                                   {comm.message}
//                                 </p>
//                               )}

//                             {/* Media/File Content */}
//                             {comm.message &&
//                               typeof comm.message === 'object' &&
//                               (comm.message.mediaURL ||
//                                 comm.message.fileName) && (
//                                 <div className="bg-white dark:bg-slate-950 rounded p-2 border border-gray-200 dark:border-gray-800">
//                                   <p className="text-foreground font-semibold truncate">
//                                     {comm.message.fileName || 'File Attachment'}
//                                   </p>
//                                 </div>
//                               )}
//                           </div>
//                         ))}
//                       </div>
//                     );
//                   },
//                 )}
//               </div>
//             )}
//           </div>
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default TemplateDetailsDialog;
