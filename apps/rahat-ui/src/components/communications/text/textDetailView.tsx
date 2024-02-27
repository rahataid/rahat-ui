'use client';

import TextDetailTable from './textDetailTable';
import TextInfoCard from '../infoCard';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import LogCard from '../logCard';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

export default function TextDetailView() {
  const logCardData = [
    { total: 5, title: 'Total SMS sent' },
    { total: 3, title: 'Banked Beneficiaries' },
    { total: 2, title: 'Unbanked Beneficiaries' },
  ];
  return (
    <>
      <div className="mt-8 grid grid-cols-3 gap-5">
        <div className="col-span-2">
          <TextInfoCard />
        </div>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Message</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is a test message</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-5">
        <Card>
          <ScrollArea className="h-custom1">
            <CardContent>
              <div className="grid grid-cols-3 gap-5 mt-8">
                {logCardData.map((item) => (
                  <LogCard title={item.title} total={item.total} />
                ))}
              </div>
              <TextDetailTable />
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </>
  );
}
