import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';

export default function CardSkeleton() {
  return (
    <Card className="p-4 rounded-sm bg-white">
      <CardTitle className="flex gap-2 pb-2">
        <div className="h-4 w-20 bg-gray-200 rounded-sm animate-pulse" />
        <div className="h-4 w-16 bg-gray-200 rounded-sm animate-pulse" />
      </CardTitle>
      <CardContent className="pl-0 pb-1">
        <div className="h-6 w-full bg-gray-200 rounded-sm animate-pulse" />
      </CardContent>
      <CardFooter className="pl-0 pb-2">
        <div className="h-6 w-full bg-gray-200 rounded-sm animate-pulse" />
      </CardFooter>
    </Card>
  );
}
