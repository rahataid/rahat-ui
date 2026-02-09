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
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useUploadCustomers } from '@rahat-ui/query';

export default function CustomersUploadPage() {
  const { id: projectUUID } = useParams() as { id: UUID };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'success' | 'error'
  >('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('idle');
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
      setUploadStatus('idle');
    }
  };

  const uploadCustomers = useUploadCustomers();
  const allowedExtensions: { [key: string]: string } = {
    xlsx: 'excel',
    xls: 'excel',
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus('uploading');

    // Determine doctype based on file extension
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    const doctype = extension ? allowedExtensions[extension] : '';

    await uploadCustomers.mutateAsync({
      projectId: projectUUID,
      selectedFile,
      doctype,
    });

    // Simulate upload
    // setTimeout(() => {
    //   setUploadStatus('success');
    // }, 2000);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
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
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card/50 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href={`/projects/el-crm/${projectUUID}/customers`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {/* Back to Customers */}
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Upload Customers
            </h1>
            <p className="text-muted-foreground">
              Import customer data from a file
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>
                Upload a CSV or Excel file containing customer data. The file
                should include columns for customer name, email, phone number,
                and other relevant information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Input Area */}
              <div className="space-y-4">
                <Label htmlFor="file-upload">Select File</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {!selectedFile ? (
                    <div className="space-y-4">
                      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Drag and drop your file here, or{' '}
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-primary hover:underline"
                          >
                            browse
                          </button>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Supports CSV, XLSX, XLS files up to 10MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                          <FileSpreadsheet className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium truncate max-w-[200px]">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveFile}
                        disabled={uploadStatus === 'uploading'}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Status */}
              {uploadStatus === 'success' && (
                <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    File uploaded successfully!
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploadStatus === 'uploading'}
                  className="flex-1"
                >
                  {uploadCustomers.isPending ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload File
                    </>
                  )}
                </Button>
                <Link href={`/projects/el-crm/${projectUUID}/customers`}>
                  <Button variant="outline">Cancel</Button>
                </Link>
              </div>

              {/* File Format Guidelines */}
              <div className="border-t pt-6">
                <h4 className="text-sm font-medium mb-3">
                  File Format Guidelines
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>- First row should contain column headers</li>
                  <li>
                    - Required columns: Customer Name, Email, Phone Number
                  </li>
                  <li>
                    - Optional columns: Last Purchase Date, Category, Status
                  </li>
                  <li>- Date format: YYYY-MM-DD</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
