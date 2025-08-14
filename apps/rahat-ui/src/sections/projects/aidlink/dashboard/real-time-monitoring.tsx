'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Alert,
  AlertDescription,
} from '@rahat-ui/shadcn/src/components/ui/alert';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Activity,
  Wifi,
  WifiOff,
  Bell,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from 'lucide-react';

export function RealTimeMonitoring() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const [liveTransactions, setLiveTransactions] = useState([
    {
      id: 1,
      beneficiary: 'John Doe',
      amount: '50.00 USDC',
      status: 'processing',
      timestamp: '2 min ago',
      txHash: '0x1234...5678',
    },
    {
      id: 2,
      beneficiary: 'Jane Smith',
      amount: '75.00 USDC',
      status: 'completed',
      timestamp: '5 min ago',
      txHash: '0x9876...5432',
    },
    {
      id: 3,
      beneficiary: 'Bob Johnson',
      amount: '100.00 USDC',
      status: 'failed',
      timestamp: '8 min ago',
      txHash: '0x5555...1111',
    },
    {
      id: 4,
      beneficiary: 'Alice Brown',
      amount: '25.00 USDC',
      status: 'processing',
      timestamp: '12 min ago',
      txHash: '0x7777...8888',
    },
    {
      id: 5,
      beneficiary: 'Charlie Wilson',
      amount: '60.00 USDC',
      status: 'completed',
      timestamp: '15 min ago',
      txHash: '0x3333...4444',
    },
  ]);

  const [systemHealth, setSystemHealth] = useState({
    xcapit: { status: 'online', responseTime: '120ms', uptime: '99.9%' },
    kotaniPay: { status: 'online', responseTime: '85ms', uptime: '99.7%' },
    ethereum: { status: 'online', responseTime: '2.1s', uptime: '100%' },
    polygon: { status: 'degraded', responseTime: '5.2s', uptime: '98.5%' },
    smsGateway: { status: 'online', responseTime: '340ms', uptime: '99.2%' },
    rahatBackend: { status: 'online', responseTime: '45ms', uptime: '99.8%' },
  });

  const [criticalAlerts, setCriticalAlerts] = useState([
    {
      id: 1,
      type: 'error',
      severity: 'high',
      message: '3 wallet creation failures in the last hour',
      timestamp: '10 min ago',
      service: 'Xcapit API',
      resolved: false,
    },
    {
      id: 2,
      type: 'warning',
      severity: 'medium',
      message: 'High gas prices detected (45 gwei)',
      timestamp: '15 min ago',
      service: 'Ethereum Network',
      resolved: false,
    },
    {
      id: 3,
      type: 'info',
      severity: 'low',
      message: 'SMS delivery rate below 95%',
      timestamp: '1 hour ago',
      service: 'SMS Gateway',
      resolved: true,
    },
  ]);

  const [networkMetrics, setNetworkMetrics] = useState({
    gasPrice: { current: 42, trend: 'up', change: '+15%', optimal: 25 },
    blockTime: { current: '12.5s', trend: 'stable', change: '0%' },
    congestion: { level: 'medium', percentage: 65 },
    pendingTxs: 1247,
    successRate: 96.8,
    avgConfirmationTime: '2.3 min',
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-600 animate-pulse" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Wifi className="h-4 w-4 text-green-600" />;
      case 'degraded':
        return <Activity className="h-4 w-4 text-yellow-600" />;
      case 'offline':
        return <WifiOff className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info':
        return <Bell className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update live transactions
      setLiveTransactions((prev) => {
        const statuses = ['completed', 'processing', 'failed'];
        const newTx = {
          id: Date.now(),
          beneficiary: `Beneficiary ${Math.floor(Math.random() * 1000)}`,
          amount: `${(Math.random() * 100 + 10).toFixed(2)} USDC`,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          timestamp: 'Just now',
          txHash: `0x${Math.random()
            .toString(16)
            .substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
        };
        return [newTx, ...prev.slice(0, 4)];
      });

      // Update network metrics
      setNetworkMetrics((prev) => ({
        ...prev,
        gasPrice: {
          ...prev.gasPrice,
          current: Math.floor(Math.random() * 20 + 30),
          trend: Math.random() > 0.5 ? 'up' : 'down',
        },
        pendingTxs: Math.floor(Math.random() * 500 + 1000),
        successRate: Number((Math.random() * 5 + 95).toFixed(1)),
      }));

      setLastUpdate(new Date());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Real-Time Monitoring
          </h2>
          <p className="text-sm text-gray-600">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts.filter(
        (alert) => !alert.resolved && alert.severity === 'high',
      ).length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Critical Alert:</strong>{' '}
            {
              criticalAlerts.filter(
                (alert) => !alert.resolved && alert.severity === 'high',
              )[0]?.message
            }
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Transaction Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Live Transaction Feed
              <Badge className="bg-green-100 text-green-800">Live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {liveTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(tx.status)}
                    <div>
                      <p className="text-sm font-medium">{tx.beneficiary}</p>
                      <p className="text-xs text-gray-600">{tx.amount}</p>
                      <p className="text-xs text-gray-500 font-mono">
                        {tx.txHash}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={
                        tx.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : tx.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {tx.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{tx.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health Indicators */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-green-600" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(systemHealth).map(([service, health]) => (
                <div
                  key={service}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex items-center gap-2">
                    {getHealthIcon(health.status)}
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {service.replace(/([A-Z])/g, ' $1')}
                      </p>
                      <p className="text-xs text-gray-600">
                        {health.responseTime} • {health.uptime} uptime
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      health.status === 'online'
                        ? 'bg-green-100 text-green-800'
                        : health.status === 'degraded'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }
                  >
                    {health.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alert Center */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-red-600" />
              Alert Center
              <Badge className="bg-red-100 text-red-800">
                {criticalAlerts.filter((alert) => !alert.resolved).length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {criticalAlerts.map((alert) => (
                <Alert
                  key={alert.id}
                  className={
                    alert.type === 'error'
                      ? 'border-red-200 bg-red-50'
                      : alert.type === 'warning'
                      ? 'border-yellow-200 bg-yellow-50'
                      : 'border-blue-200 bg-blue-50'
                  }
                >
                  <div className="flex items-start gap-2">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getSeverityBadge(alert.severity)}
                        {alert.resolved && (
                          <Badge className="bg-gray-100 text-gray-800">
                            Resolved
                          </Badge>
                        )}
                      </div>
                      <AlertDescription className="text-sm">
                        <strong>{alert.service}:</strong> {alert.message}
                      </AlertDescription>
                      <p className="text-xs text-gray-500 mt-1">
                        {alert.timestamp}
                      </p>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Status Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-600" />
            Network Status & Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-2xl font-bold">
                  {networkMetrics.gasPrice.current}
                </span>
                <span className="text-sm text-gray-600">gwei</span>
                {networkMetrics.gasPrice.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-red-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-600" />
                )}
              </div>
              <p className="text-sm text-gray-600">Gas Price</p>
              <p className="text-xs text-gray-500">
                Optimal: {networkMetrics.gasPrice.optimal} gwei
              </p>
              <Badge
                className={
                  networkMetrics.gasPrice.current >
                  networkMetrics.gasPrice.optimal * 1.5
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }
              >
                {networkMetrics.gasPrice.current >
                networkMetrics.gasPrice.optimal * 1.5
                  ? 'High'
                  : 'Normal'}
              </Badge>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold mb-2">
                {networkMetrics.blockTime.current}
              </div>
              <p className="text-sm text-gray-600">Block Time</p>
              <p className="text-xs text-gray-500">Average confirmation</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold mb-2">
                {networkMetrics.successRate}%
              </div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <Badge
                className={
                  networkMetrics.successRate > 95
                    ? 'bg-green-100 text-green-800'
                    : networkMetrics.successRate > 90
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }
              >
                {networkMetrics.successRate > 95
                  ? 'Excellent'
                  : networkMetrics.successRate > 90
                  ? 'Good'
                  : 'Poor'}
              </Badge>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold mb-2">
                {networkMetrics.pendingTxs.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Pending Transactions</p>
              <p className="text-xs text-gray-500">
                Avg confirmation: {networkMetrics.avgConfirmationTime}
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              Network Recommendations
            </h4>
            <div className="space-y-1 text-sm text-blue-800">
              {networkMetrics.gasPrice.current >
                networkMetrics.gasPrice.optimal * 1.5 && (
                <p>
                  • Consider delaying non-urgent transactions due to high gas
                  prices
                </p>
              )}
              {networkMetrics.successRate < 95 && (
                <p>
                  • Monitor transaction failures and consider increasing gas
                  limits
                </p>
              )}
              {networkMetrics.pendingTxs > 2000 && (
                <p>
                  • Network congestion detected - expect longer confirmation
                  times
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
