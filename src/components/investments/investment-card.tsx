'use client';

import Link from 'next/link';
import { ArrowDownIcon, ArrowUpIcon, ExternalLink, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { cn, formatCurrency, getStatusColor } from '@/lib/utils';
import { Investment } from '@/models/Investment';
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from '@/ui/dropdown-menu';
import { Checkbox } from '@/ui/checkbox';
import { WithId } from 'mongodb';
interface InvestmentCardProps {
  investment: WithId<Investment>;
  selectedInvestments: string[];
  onSelectInvestment: (id: string, isSelected: boolean) => void;
  onViewDetails: (investment: WithId<Investment>) => void;
}

export default function InvestmentCard({ investment, selectedInvestments, onSelectInvestment, onViewDetails }: InvestmentCardProps) {
  return (
    <Card
      key={`${investment._id}`}
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
              <Badge variant="outline">{investment.type}</Badge>
              <Badge className={getStatusColor(investment.status)}>{investment.status}</Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={selectedInvestments.includes(`${investment._id}`)}
              onCheckedChange={checked => onSelectInvestment(`${investment._id}`, checked === true)}
              aria-label={`Select investment ${investment.name}`}
              onClick={e => e.stopPropagation()}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(investment)}>View details</DropdownMenuItem>
                <DropdownMenuItem>Sell Investment</DropdownMenuItem>
                <DropdownMenuItem>Update Price</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm">
          <div>
            <div className="text-muted-foreground">Units</div>
            <div>{investment.units}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Current Value</div>
            <div className="font-medium">{formatCurrency(investment.currentValue)}</div>
          </div>
          <div className="col-span-2">
            <div className="text-muted-foreground">Profit/Loss</div>
            <div className="flex items-center">
              <div
                className={cn('font-medium', investment.profitLossPercentage >= 0 ? 'text-green-500' : 'text-red-500')}
              >
                {investment.profitLossPercentage >= 0 ? (
                  <ArrowUpIcon className="mr-1 h-3 w-3 inline" />
                ) : (
                  <ArrowDownIcon className="mr-1 h-3 w-3 inline" />
                )}
                {Math.abs(investment.profitLossPercentage).toFixed(2)}%
              </div>
              <div className="text-xs text-muted-foreground ml-2">{formatCurrency(investment.profitLoss)}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="outline" size="sm" className="w-full" onClick={() => onViewDetails(investment)}>
            View Details
          </Button>
          <Button variant="default" size="sm" className="w-full ml-2" asChild>
            <Link href={`/portfolio/transactions?investment=${investment._id}`}>
              <ExternalLink className="h-4 w-4 mr-1" />
              Transactions
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
