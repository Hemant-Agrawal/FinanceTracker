'use client';
import { Investment } from '@/models/Investment';
import { Column, DataTable } from '../common/table';
import { cn, getStatusColor } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { formatCurrency, getInvestmentTypeIcon } from '@/lib/utils';
import { WithId } from 'mongodb';
interface Props {
  investments: WithId<Investment>[];
  selectedInvestments: string[];
  onSelectInvestment: (id: string, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
  onViewDetails: (investment: WithId<Investment>) => void;
}

export function InvestmentsTable({
  investments,
  selectedInvestments,
  onSelectInvestment,
  onSelectAll,
  onViewDetails,
}: Props) {

  const columns: Column<WithId<Investment>>[] = [
    {
      key: 'name',
      label: 'Investment Name',
      sort: true,
      className: 'font-medium',
    },
    {
      key: 'type',
      label: 'Type',
      sort: true,
      render: (investment) => (
        <div className="flex items-center">
          {getInvestmentTypeIcon(investment.type)}
          <Badge variant="outline">{investment.type}</Badge>
        </div>
      ),
    },
    {
      key: 'units',
      label: 'Units',
      sort: true,
      className: 'text-right',
    },
    {
      key: 'buyPrice',
      label: 'Buy Price',
      sort: true,
      className: 'text-right',
      render: (investment) => formatCurrency(investment.buyPrice),
      hideBreakpoint: 'md',
    },
    {
      key: 'currentPrice',
      label: 'Current Price',
      sort: true,
      className: 'text-right',
      render: (investment) => formatCurrency(investment.currentPrice),
      hideBreakpoint: 'md',
    },
    {
      key: 'currentValue',
      label: 'Value',
      sort: true,
      className: 'text-right font-medium',
      render: (investment) => formatCurrency(investment.currentValue),
    },
    {
      key: 'profitLossPercentage',
      label: 'Profit/Loss',
      sort: true,
      render: (investment) => (
        <div className="space-y-1 text-right">
          <div className={cn('font-medium', investment.profitLossPercentage >= 0 ? 'text-green-500' : 'text-red-500')}>
            {investment.profitLossPercentage >= 0 ? '+' : ''}
            {investment.profitLossPercentage.toFixed(2)}%
          </div>
          <div className="text-xs text-muted-foreground">{formatCurrency(investment.profitLoss)}</div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sort: true,
      render: (investment) => <Badge className={getStatusColor(investment.status)}>{investment.status}</Badge>,
      hideBreakpoint: 'md',
    },
  ];
  

  return (
    <DataTable
      columns={columns}
      data={investments}
      onRowClick={onViewDetails}
      onSelectRow={onSelectInvestment}
      onSelectAll={onSelectAll}
      selectedRows={selectedInvestments}
    />
  );

}
