'use client';

import {
  MessageSquare,
  Mail,
  Phone,
  Hash,
  Clock,
  CreditCard,
  CheckCircle,
} from 'lucide-react';

type TransportUsage = {
  transportCuid: string;
  transportName: string;
  transportType: string;
  broadcasts: number;
  success: number;
  fail: number;
  chars: number;
  segments: number;
  duration: number;
  calls: number;
  credits: number;
};

type TransportDetailCardsProps = {
  byTransport?: TransportUsage[];
  loading?: boolean;
};

function getTransportIcon(type: string) {
  switch (type) {
    case 'SMTP':
      return Mail;
    case 'VOICE':
      return Phone;
    default:
      return MessageSquare;
  }
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

export default function TransportDetailCards({
  byTransport,
  loading,
}: TransportDetailCardsProps) {
  if (!byTransport || byTransport.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Transport Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {byTransport.map((transport) => {
          const Icon = getTransportIcon(transport.transportType);
          const successRate =
            transport.broadcasts > 0
              ? ((transport.success / transport.broadcasts) * 100).toFixed(1)
              : '0';

          return (
            <div
              key={transport.transportCuid}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center gap-2">
                <div className="bg-secondary rounded-full h-8 w-8 flex items-center justify-center text-primary">
                  <Icon size={18} />
                </div>
                <h4 className="font-semibold text-sm">
                  {transport.transportName}
                </h4>
                <span className="text-xs text-muted-foreground ml-auto">
                  {transport.transportType}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5">
                  <Hash size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Broadcasts
                  </span>
                  <span className="text-sm font-medium ml-auto">
                    {transport.broadcasts}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-green-600" />
                  <span className="text-xs text-muted-foreground">
                    Success
                  </span>
                  <span className="text-sm font-medium ml-auto">
                    {successRate}%
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CreditCard size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Credits
                  </span>
                  <span className="text-sm font-medium ml-auto">
                    {transport.credits}
                  </span>
                </div>
                {transport.transportType === 'VOICE' && (
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Duration
                    </span>
                    <span className="text-sm font-medium ml-auto">
                      {formatDuration(transport.duration)}
                    </span>
                  </div>
                )}
                {transport.transportType === 'API' && (
                  <div className="flex items-center gap-1.5">
                    <MessageSquare
                      size={14}
                      className="text-muted-foreground"
                    />
                    <span className="text-xs text-muted-foreground">
                      Segments
                    </span>
                    <span className="text-sm font-medium ml-auto">
                      {transport.segments}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
