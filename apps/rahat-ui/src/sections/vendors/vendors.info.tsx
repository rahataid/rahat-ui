import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import React from 'react';

const VendorsInfo = () => {
  return (
    <>
      <Card className="mt-2 rounded shadow">
        <div className="mt-3">
          <CardContent>
            <p className="text-primary">Vendors Name</p>
            <CardDescription>0xb8djd0djz089e204948</CardDescription>
          </CardContent>
          <CardContent>
            <p className="text-primary">9873495860</p>
            <CardDescription>Phone</CardDescription>
          </CardContent>
        </div>
      </Card>
    </>
  );
};

export default VendorsInfo;
