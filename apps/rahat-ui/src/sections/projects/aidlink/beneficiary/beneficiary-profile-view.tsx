'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@rahat-ui/shadcn/src/components/ui/avatar';
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Wallet,
  MessageSquare,
  FileText,
  Edit,
  Copy,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  Send,
  Download,
  Plus,
  Eye,
} from 'lucide-react';

interface BeneficiaryProfile {
  id: string;
  personalInfo: {
    name: string;
    phone: string;
    email?: string;
    dateOfBirth: string;
    gender: string;
    nationalId?: string;
    address: string;
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  demographics: {
    householdSize: number;
    dependents: number;
    occupation?: string;
    monthlyIncome?: number;
    vulnerabilityScore: number;
    categories: string[];
  };
  verification: {
    status: 'verified' | 'pending' | 'rejected';
    documents: Array<{
      type: string;
      status: string;
      uploadDate: string;
      verifiedBy?: string;
    }>;
    kycLevel: 'basic' | 'enhanced' | 'full';
    lastVerified: string;
  };
  wallet: {
    address: string;
    status: 'active' | 'inactive' | 'suspended';
    createdDate: string;
    provider: string;
    balance: string;
    lastActivity: string;
  };
  transactionHistory: Array<{
    id: string;
    type: 'onboarding' | 'wallet_creation' | 'disbursement' | 'sms' | 'offramp';
    amount?: string;
    status: 'completed' | 'pending' | 'failed';
    date: string;
    details: string;
    txHash?: string;
    reference?: string;
  }>;
  disbursements: Array<{
    id: string;
    amount: string;
    currency: string;
    date: string;
    status: 'completed' | 'pending' | 'failed';
    purpose: string;
    approvedBy: string;
    txHash?: string;
    fiatAmount?: string;
    exchangeRate?: string;
  }>;
  communications: Array<{
    id: string;
    type: 'sms' | 'call' | 'email' | 'in_person';
    direction: 'inbound' | 'outbound';
    content: string;
    timestamp: string;
    status: 'delivered' | 'pending' | 'failed';
    agent?: string;
    messageId?: string;
  }>;
  notes: Array<{
    id: string;
    content: string;
    author: string;
    timestamp: string;
    category: 'general' | 'issue' | 'follow_up' | 'verification';
    priority: 'low' | 'medium' | 'high';
  }>;
  groups: string[];
  tags: string[];
  status: 'active' | 'inactive' | 'suspended';
  createdDate: string;
  lastUpdated: string;
}

interface BeneficiaryProfileViewProps {
  beneficiaryId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function BeneficiaryProfileView({
  beneficiaryId,
  isOpen,
  onClose,
}: BeneficiaryProfileViewProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState('general');

  // Sample beneficiary data - in real app, this would be fetched based on beneficiaryId
  const beneficiary: BeneficiaryProfile = {
    id: 'ben-001',
    personalInfo: {
      name: 'John Doe',
      phone: '+254712345678',
      email: 'john.doe@example.com',
      dateOfBirth: '1985-03-15',
      gender: 'Male',
      nationalId: '12345678',
      address: '123 Main Street, Nairobi, Kenya',
      emergencyContact: {
        name: 'Jane Doe',
        phone: '+254712345679',
        relationship: 'Spouse',
      },
    },
    demographics: {
      householdSize: 5,
      dependents: 3,
      occupation: 'Small Business Owner',
      monthlyIncome: 15000,
      vulnerabilityScore: 7.5,
      categories: [
        'Food Security',
        'Economic Vulnerability',
        'Head of Household',
      ],
    },
    verification: {
      status: 'verified',
      documents: [
        {
          type: 'National ID',
          status: 'verified',
          uploadDate: '2025-07-01',
          verifiedBy: 'Agent Smith',
        },
        {
          type: 'Proof of Address',
          status: 'verified',
          uploadDate: '2025-07-01',
          verifiedBy: 'Agent Smith',
        },
        { type: 'Bank Statement', status: 'pending', uploadDate: '2025-07-02' },
      ],
      kycLevel: 'enhanced',
      lastVerified: '2025-07-01',
    },
    wallet: {
      address: '0x1234567890abcdef1234567890abcdef12345678',
      status: 'active',
      createdDate: '2025-07-01',
      provider: 'Xcapit',
      balance: '25.50 USDC',
      lastActivity: '2025-07-03',
    },
    transactionHistory: [
      {
        id: 'tx-001',
        type: 'onboarding',
        status: 'completed',
        date: '2025-07-01T10:00:00Z',
        details: 'Beneficiary successfully onboarded via CSV upload',
      },
      {
        id: 'tx-002',
        type: 'wallet_creation',
        status: 'completed',
        date: '2025-07-01T10:05:00Z',
        details: 'Wallet created successfully via Xcapit API',
        txHash: '0xabc123def456...',
      },
      {
        id: 'tx-003',
        type: 'disbursement',
        amount: '100 USDC',
        status: 'completed',
        date: '2025-07-02T14:30:00Z',
        details: 'Emergency relief disbursement',
        txHash: '0xdef789abc123...',
        reference: 'DISB-001',
      },
      {
        id: 'tx-004',
        type: 'sms',
        status: 'completed',
        date: '2025-07-02T14:35:00Z',
        details: 'SMS notification sent for disbursement',
        reference: 'SMS-001',
      },
      {
        id: 'tx-005',
        type: 'offramp',
        amount: '75 USDC',
        status: 'completed',
        date: '2025-07-02T15:00:00Z',
        details: 'Successfully converted to 6,402.75 KES via Kotani Pay',
        reference: 'OFF-001',
      },
    ],
    disbursements: [
      {
        id: 'disb-001',
        amount: '100',
        currency: 'USDC',
        date: '2025-07-02',
        status: 'completed',
        purpose: 'Emergency Relief',
        approvedBy: 'Project Manager',
        txHash: '0xdef789abc123...',
        fiatAmount: '8,537 KES',
        exchangeRate: '85.37',
      },
      {
        id: 'disb-002',
        amount: '75',
        currency: 'USDC',
        date: '2025-07-03',
        status: 'pending',
        purpose: 'Food Security Support',
        approvedBy: 'Field Coordinator',
      },
    ],
    communications: [
      {
        id: 'comm-001',
        type: 'sms',
        direction: 'outbound',
        content:
          'Your disbursement of 100 USDC has been processed. Check your wallet for details.',
        timestamp: '2025-07-02T14:35:00Z',
        status: 'delivered',
        messageId: 'SMS-001',
      },
      {
        id: 'comm-002',
        type: 'call',
        direction: 'inbound',
        content:
          'Beneficiary called to inquire about disbursement status. Provided update and guidance.',
        timestamp: '2025-07-02T16:20:00Z',
        status: 'completed',
        agent: 'Support Agent 1',
      },
      {
        id: 'comm-003',
        type: 'sms',
        direction: 'outbound',
        content:
          'Welcome to the AidLink program. Your wallet has been created successfully.',
        timestamp: '2025-07-01T10:10:00Z',
        status: 'delivered',
        messageId: 'SMS-002',
      },
      {
        id: 'comm-004',
        type: 'email',
        direction: 'outbound',
        content: 'Program enrollment confirmation and next steps',
        timestamp: '2025-07-01T10:15:00Z',
        status: 'delivered',
      },
    ],
    notes: [
      {
        id: 'note-001',
        content:
          'Beneficiary is head of household with 3 dependents. Prioritize for food security programs.',
        author: 'Field Officer',
        timestamp: '2025-07-01T11:00:00Z',
        category: 'general',
        priority: 'medium',
      },
      {
        id: 'note-002',
        content:
          'Follow up needed on bank statement verification. Document quality was poor.',
        author: 'Verification Team',
        timestamp: '2025-07-02T09:30:00Z',
        category: 'verification',
        priority: 'high',
      },
      {
        id: 'note-003',
        content:
          'Beneficiary successfully completed first offramp transaction. No issues reported.',
        author: 'Support Team',
        timestamp: '2025-07-02T15:30:00Z',
        category: 'general',
        priority: 'low',
      },
    ],
    groups: ['Emergency Relief - Zone A', 'Food Security - Rural Areas'],
    tags: ['High Priority', 'Head of Household', 'Verified'],
    status: 'active',
    createdDate: '2025-07-01',
    lastUpdated: '2025-07-03',
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'verified':
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'verified':
      case 'delivered':
      case 'active':
        return <Badge className="bg-green-100 text-green-800">{status}</Badge>;
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">{status}</Badge>
        );
      case 'failed':
      case 'rejected':
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">{status}</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{priority}</Badge>;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const addNote = () => {
    if (newNote.trim()) {
      // In real app, this would make an API call
      console.log('Adding note:', {
        content: newNote,
        category: newNoteCategory,
      });
      setNewNote('');
      setNewNoteCategory('general');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Beneficiary Profile</DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-xl bg-blue-100 text-blue-600">
                    {beneficiary.personalInfo.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold">
                      {beneficiary.personalInfo.name}
                    </h3>
                    {getStatusBadge(beneficiary.status)}
                    {getStatusBadge(beneficiary.verification.status)}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{beneficiary.personalInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{beneficiary.personalInfo.gender}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>
                        {new Date(
                          beneficiary.personalInfo.dateOfBirth,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>Zone A</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {beneficiary.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-blue-50 text-blue-700"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Beneficiary ID</div>
                  <div className="font-mono text-sm">{beneficiary.id}</div>
                  <div className="text-sm text-gray-500 mt-2">Joined</div>
                  <div className="text-sm">
                    {new Date(beneficiary.createdDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-6 bg-gray-100">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="disbursements">Disbursements</TabsTrigger>
              <TabsTrigger value="communications">Communications</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Full Name
                        </Label>
                        <p className="font-medium">
                          {beneficiary.personalInfo.name}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Phone Number
                        </Label>
                        <p className="font-medium">
                          {beneficiary.personalInfo.phone}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Email
                        </Label>
                        <p className="font-medium">
                          {beneficiary.personalInfo.email || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          National ID
                        </Label>
                        <p className="font-medium">
                          {beneficiary.personalInfo.nationalId ||
                            'Not provided'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Address
                      </Label>
                      <p className="font-medium">
                        {beneficiary.personalInfo.address}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Emergency Contact
                      </Label>
                      <p className="font-medium">
                        {beneficiary.personalInfo.emergencyContact.name} (
                        {beneficiary.personalInfo.emergencyContact.relationship}
                        )
                      </p>
                      <p className="text-sm text-gray-600">
                        {beneficiary.personalInfo.emergencyContact.phone}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Demographics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Demographics & Vulnerability</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Household Size
                        </Label>
                        <p className="font-medium">
                          {beneficiary.demographics.householdSize} members
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Dependents
                        </Label>
                        <p className="font-medium">
                          {beneficiary.demographics.dependents}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Occupation
                        </Label>
                        <p className="font-medium">
                          {beneficiary.demographics.occupation ||
                            'Not specified'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Monthly Income
                        </Label>
                        <p className="font-medium">
                          {beneficiary.demographics.monthlyIncome
                            ? `${beneficiary.demographics.monthlyIncome.toLocaleString()} KES`
                            : 'Not specified'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Vulnerability Score
                      </Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{
                              width: `${
                                (beneficiary.demographics.vulnerabilityScore /
                                  10) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="font-medium">
                          {beneficiary.demographics.vulnerabilityScore}/10
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Categories
                      </Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {beneficiary.demographics.categories.map(
                          (category, index) => (
                            <Badge key={index} variant="outline">
                              {category}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Wallet Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-5 w-5" />
                      Wallet Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Wallet Address
                        </Label>
                        <p className="font-mono text-sm">
                          {truncateAddress(beneficiary.wallet.address)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(beneficiary.wallet.address)
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Status
                        </Label>
                        <p>{getStatusBadge(beneficiary.wallet.status)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Balance
                        </Label>
                        <p className="font-medium">
                          {beneficiary.wallet.balance}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Provider
                        </Label>
                        <p className="font-medium">
                          {beneficiary.wallet.provider}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Created
                        </Label>
                        <p className="font-medium">
                          {new Date(
                            beneficiary.wallet.createdDate,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Groups */}
                <Card>
                  <CardHeader>
                    <CardTitle>Group Memberships</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {beneficiary.groups.map((group, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <span className="font-medium">{group}</span>
                          <Badge variant="outline">Active</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Complete Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {beneficiary.transactionHistory.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-start gap-4 p-4 border rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          {getStatusIcon(tx.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium capitalize">
                                {tx.type.replace('_', ' ')}
                              </span>
                              {tx.amount && (
                                <Badge variant="outline">{tx.amount}</Badge>
                              )}
                            </div>
                            <div className="text-right">
                              {getStatusBadge(tx.status)}
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(tx.date).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {tx.details}
                          </p>
                          {tx.txHash && (
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-gray-500">TX Hash:</span>
                              <span className="font-mono text-blue-600">
                                {tx.txHash}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                          {tx.reference && (
                            <div className="text-xs text-gray-500">
                              <span>Reference: {tx.reference}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="disbursements" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Disbursement History</CardTitle>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Disbursement
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {beneficiary.disbursements.map((disbursement) => (
                      <div
                        key={disbursement.id}
                        className="p-4 border rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">
                              {disbursement.amount} {disbursement.currency}
                            </span>
                            {getStatusBadge(disbursement.status)}
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {new Date(disbursement.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              by {disbursement.approvedBy}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Purpose:</span>
                            <p className="font-medium">
                              {disbursement.purpose}
                            </p>
                          </div>
                          {disbursement.fiatAmount && (
                            <div>
                              <span className="text-gray-500">
                                Fiat Amount:
                              </span>
                              <p className="font-medium">
                                {disbursement.fiatAmount}
                              </p>
                            </div>
                          )}
                          {disbursement.exchangeRate && (
                            <div>
                              <span className="text-gray-500">
                                Exchange Rate:
                              </span>
                              <p className="font-medium">
                                {disbursement.exchangeRate}
                              </p>
                            </div>
                          )}
                          {disbursement.txHash && (
                            <div>
                              <span className="text-gray-500">TX Hash:</span>
                              <div className="flex items-center gap-1">
                                <p className="font-mono text-xs text-blue-600">
                                  {truncateAddress(disbursement.txHash)}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="communications" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Communication History
                    </CardTitle>
                    <Button size="sm">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {beneficiary.communications.map((comm) => (
                      <div key={comm.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={
                                comm.direction === 'outbound'
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-green-50 text-green-700'
                              }
                            >
                              {comm.direction} {comm.type}
                            </Badge>
                            {getStatusBadge(comm.status)}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              {new Date(comm.timestamp).toLocaleString()}
                            </p>
                            {comm.agent && (
                              <p className="text-xs text-gray-500">
                                by {comm.agent}
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="text-sm">{comm.content}</p>
                        {comm.messageId && (
                          <p className="text-xs text-gray-500 mt-2">
                            Message ID: {comm.messageId}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Documents & Verification
                    </CardTitle>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          KYC Level: {beneficiary.verification.kycLevel}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Last verified:{' '}
                          {new Date(
                            beneficiary.verification.lastVerified,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(beneficiary.verification.status)}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {beneficiary.verification.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded"
                      >
                        <div>
                          <p className="font-medium">{doc.type}</p>
                          <p className="text-sm text-gray-600">
                            Uploaded:{' '}
                            {new Date(doc.uploadDate).toLocaleDateString()}
                            {doc.verifiedBy &&
                              ` • Verified by: ${doc.verifiedBy}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(doc.status)}
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Case Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="p-4 border rounded-lg">
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Add a new note..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                        />
                        <div className="flex items-center justify-between">
                          <select
                            value={newNoteCategory}
                            onChange={(e) => setNewNoteCategory(e.target.value)}
                            className="px-3 py-1 border rounded text-sm"
                          >
                            <option value="general">General</option>
                            <option value="issue">Issue</option>
                            <option value="follow_up">Follow Up</option>
                            <option value="verification">Verification</option>
                          </select>
                          <Button onClick={addNote} disabled={!newNote.trim()}>
                            Add Note
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {beneficiary.notes.map((note) => (
                      <div key={note.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="capitalize">
                              {note.category}
                            </Badge>
                            {getPriorityBadge(note.priority)}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{note.author}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(note.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm">{note.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
