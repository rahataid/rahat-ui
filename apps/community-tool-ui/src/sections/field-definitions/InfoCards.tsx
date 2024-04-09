import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { FieldDefinition } from '@rahataid/community-tool-sdk/fieldDefinitions';

export default function InfoCards({ data }: { data: FieldDefinition }) {
  return (
    <div className="grid grid-cols-1 gap-4 p-2">
      <Card className="shadow-md rounded-sm">
        <CardContent>
          <div className="flex justify-between gap-8">
            <div className="flex flex-col gap-2">
              <div>
                <p>{data?.name ?? ''}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Name
                </p>
              </div>
              <div>
                <p>{data?.fieldType ?? ''}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  FieldType
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <p>{data?.isActive ? 'True' : 'False'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  isActive
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div>
                {data?.fieldPopulate?.data?.length > 0 && (
                  <>
                    {data.fieldPopulate.data.map((item: any, key: number) => (
                      <li key={key}>{item.value}</li>
                    ))}
                    <p className="text-sm font-normal text-muted-foreground">
                      Field Populate
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
