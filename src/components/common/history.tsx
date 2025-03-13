import React from 'react';
import { Badge } from '../ui/badge';
import { ArrowUpDown } from 'lucide-react';
import { formatDateWithTime } from '@/lib/date';
import { History } from '@/models/History';

interface HistoryCardProps extends History {
  user: string;
}
export default function HistoryCard({ action, date, details, user }: HistoryCardProps) {
  return (
    <div className="flex items-start gap-3 pb-3 border-b">
      <div className="mt-0.5">
        <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
          <ArrowUpDown className="h-3 w-3" />
        </Badge>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-medium">{action}</p>
          <p className="text-sm text-muted-foreground">{formatDateWithTime(date)}</p>
        </div>
        <p className="text-sm mt-1">{details}</p>
        <p className="text-xs text-muted-foreground mt-1">By {user}</p>
      </div>
    </div>
  );
};
