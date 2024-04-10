import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { FieldDefinition } from '@rahataid/community-tool-sdk/fieldDefinitions';

export default function InfoCards({ data }: { data: FieldDefinition }) {
  return (
    <div className="p-2">
      <Card className="shadow-md rounded-sm">
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 flex flex-col gap-4">
              <div>
                <p>{data?.name ?? ''}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Name
                </p>
              </div>
              <div>
                <p>{data?.isActive ? 'True' : 'False'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  isActive
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <p>{data?.fieldType ?? ''}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  FieldType
                </p>
              </div>
              <div>
                <p>{data?.isTargeting ? 'True' : 'False'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  User for Targeting
                </p>
              </div>
            </div>
            {data?.fieldPopulate?.data?.length > 0 && (
              <div className="col-span-3 overflow-hidden">
                <div className="flex flex-col gap-2">
                  <ul className="list-disc pl-4">
                    {data?.fieldPopulate?.data?.map(
                      (item: any, key: number) => (
                        <li key={key}>{item.value}</li>
                      ),
                    )}
                  </ul>
                  <p className="text-sm font-normal text-muted-foreground">
                    Field Populate
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
