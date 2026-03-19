'use client';

import React from 'react';

import { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@rahat-ui/shadcn/components/card';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Input } from '@rahat-ui/shadcn/components/input';
import { Label } from '@rahat-ui/shadcn/components/label';
import {
  ArrowLeft,
  Upload,
  FileSpreadsheet,
  X,
  CheckCircle,
  Download,
  AlertCircle,
  Info,
  FileUp,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { useUploadCustomers } from '@rahat-ui/query';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

export default function CustomersUploadPage() {
  const { id: projectUUID } = useParams() as { id: UUID };
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const uploadCustomers = useUploadCustomers();
  const allowedExtensions: { [key: string]: string } = {
    xlsx: 'excel',
    xls: 'excel',
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    // Determine doctype based on file extension
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    const doctype = extension ? allowedExtensions[extension] : '';

    await uploadCustomers.mutateAsync({
      projectId: projectUUID,
      selectedFile,
      doctype,
    });

    router.push(`/projects/el-crm/${projectUUID}/customers`);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    );
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        {/* Page Header */}
        <div className="border-b border-border bg-card px-6 py-5">
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/projects/el-crm/${projectUUID}/customers`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Back to Customers</p>
              </TooltipContent>
            </Tooltip>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Upload Customers
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Import customer data from a file
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Main Upload Card */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <FileUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Upload File</CardTitle>
                    <CardDescription className="mt-0.5">
                      Upload an Excel file containing customer data
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* File Drop Zone */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="file-upload"
                      className="text-sm font-medium"
                    >
                      Select File
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      Supported: .xlsx, .xls
                    </span>
                  </div>
                  <div
                    className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
                      isDragging
                        ? 'border-primary bg-primary/5 scale-[1.01]'
                        : selectedFile
                        ? 'border-primary/30 bg-primary/[0.02]'
                        : 'border-border hover:border-muted-foreground/40 hover:bg-muted/30'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Input
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {!selectedFile ? (
                      <div className="flex flex-col items-center justify-center py-10 px-6">
                        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                          <Upload className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-foreground">
                          Drag and drop your file here, or{' '}
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-primary font-medium hover:underline underline-offset-2"
                          >
                            browse
                          </button>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1.5">
                          Maximum file size: 10MB
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileSpreadsheet className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(selectedFile.size)} · Ready to
                              upload
                            </p>
                          </div>
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                              onClick={handleRemoveFile}
                              disabled={uploadCustomers.isPending}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove file</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Status */}
                {uploadCustomers.isSuccess && (
                  <div className="flex items-center gap-2.5 p-3.5 bg-success/10 border border-success/20 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-success shrink-0" />
                    <span className="text-sm font-medium text-success">
                      File uploaded successfully! Redirecting...
                    </span>
                  </div>
                )}

                {uploadCustomers.isError && (
                  <div className="flex items-center gap-2.5 p-3.5 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                    <span className="text-sm font-medium text-destructive">
                      Upload failed. Please check your file and try again.
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href="/files/sample_customer.xlsx" download>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-3.5 w-3.5" />
                          Download Sample
                        </Button>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Download a sample Excel template with the correct format
                      </p>
                    </TooltipContent>
                  </Tooltip>

                  <div className="flex-1" />

                  <Link href={`/projects/el-crm/${projectUUID}/customers`}>
                    <Button variant="ghost" size="sm">
                      Cancel
                    </Button>
                  </Link>

                  <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploadCustomers.isPending}
                    size="sm"
                    className="gap-2 min-w-[120px]"
                  >
                    {uploadCustomers.isPending ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5" />
                        Upload File
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* File Format Guidelines */}
            <Card className="border-dashed">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-lg bg-muted p-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      File Format Guidelines
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="shrink-0 mt-1.5 h-1 w-1 rounded-full bg-muted-foreground/50" />
                        First row should contain column headers
                      </li>
                      {/* <li className="flex items-start gap-2">
                        <span className="shrink-0 mt-1.5 h-1 w-1 rounded-full bg-muted-foreground/50" />
                        Required columns: Customer Name, Phone Number
                      </li> */}
                      {/* <li className="flex items-start gap-2">
                        <span className="shrink-0 mt-1.5 h-1 w-1 rounded-full bg-muted-foreground/50" />
                        Optional: Email, BDE/BDM, Channel, Region, Source,
                        Category
                      </li> */}
                      <li className="flex items-start gap-2">
                        <span className="shrink-0 mt-1.5 h-1 w-1 rounded-full bg-muted-foreground/50" />
                        Date format: MM-DD-YYYY
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
