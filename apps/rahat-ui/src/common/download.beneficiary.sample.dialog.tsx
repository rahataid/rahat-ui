'use client';

import * as React from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/components/dialog';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import SearchableDropdown from './searchable.dropdown';

export type SampleTemplate = {
  value: string;
  label: string;
  fileName: string;
  headers: string[];
};

type IProps = {
  templates: SampleTemplate[];
  sheetName?: string;
};

export default function DownloadBeneficiarySampleDialog({
  templates,
  sheetName = 'Sheet1',
}: IProps) {
  const t = useTranslations('GLOBAL');
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState('');

  const templateOptions = templates.map((template) => ({
    value: template.value,
    label: template.label,
  }));

  const handleOpen = () => {
    setSelectedValue('');
    setOpen(true);
  };

  const handleSelectTemplate = (templateValue: string) => {
    setSelectedValue(templateValue);
  };

  const handleDownload = () => {
    if (!selectedValue) {
      toast.error(t('PLEASE_SELECT_A_SAMPLE_TEMPLATE'));
      return;
    }

    const template = templates.find((tpl) => tpl.value === selectedValue);
    if (!template) return;

    const worksheet = XLSX.utils.aoa_to_sheet([template.headers]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const firstRowStyle = {
      font: { bold: true },
      alignment: { horizontal: 'center' },
    };

    template.headers.forEach((_, index) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
      if (!worksheet[cellRef]) {
        worksheet[cellRef] = { t: 's', v: '' };
      }
      worksheet[cellRef].s = firstRowStyle;
    });

    XLSX.writeFile(workbook, template.fileName);
    setOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="gap-2 shrink-0"
        onClick={handleOpen}
      >
        <Download size={16} />
        {t('DOWNLOAD_SAMPLE')}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('DOWNLOAD_SAMPLE')}</DialogTitle>
            <DialogDescription>
              {t('SELECT_A_SAMPLE_TEMPLATE_TO_DOWNLOAD')}
            </DialogDescription>
          </DialogHeader>

          <div className="pt-2">
            <SearchableDropdown
              options={templateOptions}
              value={selectedValue}
              placeholder={t('SAMPLE_TEMPLATE')}
              searchPlaceholder={t('SELECT_FIELD_PLACEHOLDER')}
              emptyMessage={t('NO_FIELD_FOUND')}
              onSelect={handleSelectTemplate}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              {t('CANCEL')}
            </Button>
            <Button type="button" className="flex-1" onClick={handleDownload}>
              {t('DOWNLOAD')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
