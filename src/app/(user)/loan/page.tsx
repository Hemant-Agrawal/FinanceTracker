import { DashboardHeader, DashboardShell } from '@/components/dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/date';
import { formatCurrency } from '@/lib/utils';
import { AmortizationSchedule } from '@/components/loans/amortization-schedule';
import { PaymentHistory } from '@/components/loans/payment-history';
import { UpcomingPayments } from '@/components/loans/upcoming-payments';
import { ObjectId } from 'mongodb';

const InformationView = ({ label, value }: { label: string; value: string | number }) => (
  <div className="space-y-1">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="text-xl font-semibold">{value}</p>
  </div>
);

export default function LoansPage() {
  const loan = {
    _id: new ObjectId(),
    name: 'Home Loan',
    lender: 'ABC Bank',
    principalAmount: 2590000,
    interestRate: 8.4,
    tenure: 120, // months
    emiAmount: 31974,
    startDate: '2023-10-5',
    remainingBalance: 256789.45,
    totalPaid: 43210.55,
    nextPaymentDate: '2025-03-15',
    loanDetails: 'Home Loan',
    isActive: true,
  };

  return (
    <DashboardShell>
      <Tabs defaultValue="overview">
        <DashboardHeader heading={`${loan.name} (${loan.lender})`} text="Detailed information about your loans">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Payments</TabsTrigger>
          </TabsList>
        </DashboardHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InformationView label="Principal Amount" value={formatCurrency(loan.principalAmount)} />
          <InformationView label="Interest Rate" value={`${loan.interestRate}%`} />
          <InformationView label="Loan Term" value={`${loan.tenure} months`} />
          <InformationView label="EMI Amount" value={formatCurrency(loan.emiAmount)} />
          <InformationView label="Start Date" value={formatDate(loan.startDate)} />
          <InformationView label="Remaining Balance" value={formatCurrency(loan.remainingBalance)} />
          <InformationView label="Total Paid" value={formatCurrency(loan.totalPaid)} />
          <InformationView label="Next Payment" value={formatDate(loan.nextPaymentDate)} />
        </div>
        <TabsContent value="overview">
          <h3 className="text-lg font-medium my-4">Amortization Schedule</h3>
          <AmortizationSchedule loan={loan} />
        </TabsContent>
        <TabsContent value="history">
          <h3 className="text-lg font-medium my-4">Payment History</h3>
          <PaymentHistory loan={loan} />
        </TabsContent>
        <TabsContent value="upcoming">
          <h3 className="text-lg font-medium my-4">Upcoming Payments</h3>
          <UpcomingPayments loan={loan} />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
