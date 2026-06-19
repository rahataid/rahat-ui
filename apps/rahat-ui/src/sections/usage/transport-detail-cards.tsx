'use client';

import { DataCard } from '../../common/data.card';
import {
  MessageSquare,
  Mail,
  Phone,
  Hash,
  Clock,
  CreditCard,
  CheckCircle,
} from 'lucide-react';

type Transport = {
  id: number;
  cuid: string;
  name: string;
  type: string;
};

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
  transports?: Transport[];
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
  transports,
  byTransport,
  loading,
}: TransportDetailCardsProps) {
  if (!transports || transports.length === 0) return null;

  const usageMap = new Map(
    byTransport?.map((t) => [t.transportCuid, t]) ?? [],
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Transport Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {transports.map((transport) => {
          const usage = usageMap.get(transport.cuid);
          const Icon = getTransportIcon(transport.type);
          const successRate =
            usage && usage.broadcasts > 0
              ? ((usage.success / usage.broadcasts) * 100).toFixed(1)
              : '0';

          return (
            <div
              key={transport.cuid}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center gap-2">
                <div className="bg-secondary rounded-full h-8 w-8 flex items-center justify-center text-primary">
                  <Icon size={18} />
                </div>
                <h4 className="font-semibold text-sm">{transport.name}</h4>
                <span className="text-xs text-muted-foreground ml-auto">
                  {transport.type}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5">
                  <Hash size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Broadcasts
                  </span>
                  <span className="text-sm font-medium ml-auto">
                    {usage?.broadcasts ?? 0}
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
                    {usage?.credits ?? 0}
                  </span>
                </div>
                {transport.type === 'VOICE' && (
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Duration
                    </span>
                    <span className="text-sm font-medium ml-auto">
                      {formatDuration(usage?.duration ?? 0)}
                    </span>
                  </div>
                )}
                {transport.type === 'API' && (
                  <div className="flex items-center gap-1.5">
                    <MessageSquare
                      size={14}
                      className="text-muted-foreground"
                    />
                    <span className="text-xs text-muted-foreground">
                      Segments
                    </span>
                    <span className="text-sm font-medium ml-auto">
                      {usage?.segments ?? 0}
                    </span>
                  </div>
                )}
                {transport.type === 'SMTP' && (
                  <div className="flex items-center gap-1.5">
                    <Mail size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Calls
                    </span>
                    <span className="text-sm font-medium ml-auto">
                      {usage?.calls ?? 0}
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
