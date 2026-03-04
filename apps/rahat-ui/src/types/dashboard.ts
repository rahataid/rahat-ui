export interface BroadcastStats {
  sessionStats: {
    count: number;
    totalRecipients: number;
  };
  messageStats: {
    totalMessages: number;
    successCount: number;
    failedCount: number;
    pendingCount: number;
    successRate: number;
  };
  transportStats: TransportStat[];
}

export interface TransportStat {
  transport: string;
  name: string;
  type: string;
  totalRecipients: number;
  broadcasts: {
    total: number;
    success: number;
    failed: number;
    pending: number;
    averageAttempts: number;
    maxAttempts: number;
  };
}
