'use client';

import { ArrowDownIcon, ArrowUpIcon, ExternalLink, Info } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/ui/card';
import { Badge, BadgeProps } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/tooltip';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Investment } from '@/models/Investment';
import { formatDateWithTime } from '@/lib/date';

interface InvestmentCardProps {
  investment: Investment;
  onViewDetails: () => void;
}

// Determine badge variant based on investment type
const getBadgeVariant = (type: string) => {
  switch (type) {
    case 'Stock':
      return 'default';
    case 'Mutual Fund':
      return 'secondary';
    case 'Bond':
      return 'outline';
    case 'Fixed Deposit':
      return 'destructive';
    case 'ETF':
      return 'default';
    case 'Insurance':
      return 'secondary';
    default:
      return 'outline';
  }
};

// Determine status badge variant
const getStatusBadgeVariant = (status: string): BadgeProps['variant'] => {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Matured':
      return 'secondary';
    case 'Closed':
      return 'destructive';
    default:
      return 'outline';
  }
};

export function InvestmentCardV2({ investment, onViewDetails }: InvestmentCardProps) {

  // Check if investment has interest or dividends
  const hasInterest = investment.type === 'Bond' || investment.type === 'Fixed Deposit';
  const hasDividends = investment.type === 'Stock' || investment.type === 'ETF';

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all hover:shadow-md',
        investment.status === 'Matured' &&
          'border-green-200 bg-green-50/30 dark:bg-green-950/10 dark:border-green-900/50'
      )}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium text-base line-clamp-1">{investment.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getBadgeVariant(investment.type)}>{investment.type}</Badge>
              <Badge variant={getStatusBadgeVariant(investment.status)}>{investment.status}</Badge>
              {hasInterest && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/20">
                        Interest-bearing
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This investment earns regular interest</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {hasDividends && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="bg-purple-50 dark:bg-purple-950/20">
                        Dividend
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This investment pays dividends</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          <div className={cn('text-right', investment.profitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600')}>
            <div className="flex items-center justify-end font-medium">
              {investment.profitLossPercentage >= 0 ? (
                <ArrowUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-1" />
              )}
              {Math.abs(investment.profitLossPercentage).toFixed(2)}%
            </div>
            <div className="text-xs text-muted-foreground">
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                signDisplay: 'always',
              }).format(investment.profitLoss)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm">
          <div>
            <div className="text-muted-foreground">Units</div>
            <div>{investment.units}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Buy Price</div>
            <div>
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
              }).format(investment.buyPrice)}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Current Price</div>
            <div>
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
              }).format(investment.currentPrice)}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Current Value</div>
            <div className="font-medium">
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
              }).format(investment.currentValue)}
            </div>
          </div>
        </div>

        {investment.status === 'Matured' && (
          <div className="mt-3 p-2 bg-green-50 dark:bg-green-950/20 rounded-md text-sm">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-700 dark:text-green-400">
                  Matured on {formatDateWithTime(investment.updatedAt!)}
                </p>
                <p className="text-green-600 dark:text-green-500 mt-1">
                  This investment has matured. You can withdraw or reinvest the amount.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between p-4 pt-0 gap-2">
        <Button variant="outline" size="sm" className="w-full" onClick={onViewDetails}>
          View Details
        </Button>
        <Button variant="default" size="sm" className="w-full" asChild>
          <Link href={`/portfolio/transactions?investment=${investment._id}`}>
            <ExternalLink className="h-4 w-4 mr-1" />
            Transactions
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
