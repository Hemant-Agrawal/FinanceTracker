import { Card, CardContent, CardHeader } from '@/ui/card';
import { Skeleton } from '@/ui/skeleton';

export function PortfolioSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-5 w-[140px]" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[120px] mb-2" />
          <Skeleton className="h-4 w-[100px]" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-5 w-[140px]" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[120px] mb-2" />
          <Skeleton className="h-4 w-[100px]" />
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-[140px] mb-2" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-[80px]" />
            <Skeleton className="h-8 w-[80px]" />
            <Skeleton className="h-8 w-[80px]" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2 lg:col-span-4">
        <CardHeader>
          <Skeleton className="h-6 w-[180px] mb-2" />
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
