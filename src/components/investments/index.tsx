'use client';

import { useSearchParams } from 'next/navigation';
import { InvestmentsTable } from './investments-table';
import InvestmentCard from './investment-card';
import { useTableGridContext } from '@/table-grid-view/provider';
import { Investment } from '@/models/Investment';
import { InvestmentDetailsDialog } from './investment-details-dialog';
import { WithId } from 'mongodb';
interface InvestmentListProps {
  investments: WithId<Investment>[];
}

export default function Investments({ investments }: InvestmentListProps) {
  const {
    selectedItems,
    handleSelectAll,
    handleSelectItem,
    handleViewItem,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    currentItem,
  } = useTableGridContext();

  const isListView = useSearchParams().get('view') !== 'grid';

  return (
    <>
      {isListView ? (
        <InvestmentsTable
          investments={investments}
          selectedInvestments={selectedItems}
          onSelectInvestment={handleSelectItem}
          onSelectAll={value => handleSelectAll(value, investments)}
          onViewDetails={handleViewItem}
        />
      ) : (
        // Card view for mobile/alternative view
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {investments.length === 0 ? (
            <div className="col-span-full text-center py-10">No investments found.</div>
          ) : (
            investments.map(investment => (
              <InvestmentCard
                key={`${investment._id}`}
                investment={investment}
                selectedInvestments={selectedItems}
                onSelectInvestment={handleSelectItem}
                onViewDetails={handleViewItem}
              />
            ))
          )}
        </div>
      )}
      {isDetailsModalOpen && currentItem && (
        <InvestmentDetailsDialog
          open={isDetailsModalOpen}
          investment={currentItem as WithId<Investment>}
          onOpenChange={setIsDetailsModalOpen}
        />
      )}
    </>
  );
}
