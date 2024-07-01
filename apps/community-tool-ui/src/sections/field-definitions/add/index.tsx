'use client';
import { useState } from 'react';
import ExcelUploader from '../import/ExcelUploader';
import FieldDefAdd from './addFieldDefinitions';

export default function AddFieldDefinitions() {
  const [activeTab, setActiveTab] = useState<'add' | 'import' | null>('add');
  const handleTabChange = (tab: 'add' | 'import') => {
    setActiveTab(tab);
  };
  return (
    <>
      {activeTab === 'add' && <FieldDefAdd handleTabChange={handleTabChange} />}

      {activeTab === 'import' && (
        <div className="p-4 h-add rounded border bg-white">
          <ExcelUploader handleTabChange={handleTabChange} />
        </div>
      )}
    </>
  );
}
