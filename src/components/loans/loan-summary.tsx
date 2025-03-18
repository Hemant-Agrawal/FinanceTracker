import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

interface LoanProps {
  loan: {
    id: string
    name: string
    lender: string
    principalAmount: number
    interestRate: number
    tenure: number
    emiAmount: number
    startDate: string
    remainingBalance: number
    totalPaid: number
    nextPaymentDate: string
    status: string
  }
}

export function LoanSummary({ loan }: LoanProps) {
  const progressPercentage = (loan.totalPaid / loan.principalAmount) * 100

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{loan.name}</CardTitle>
        <CardDescription>{loan.lender}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Principal</span>
          <span className="font-medium">{formatCurrency(loan.principalAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Interest Rate</span>
          <span className="font-medium">{loan.interestRate}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">EMI Amount</span>
          <span className="font-medium">{formatCurrency(loan.emiAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Next Payment</span>
          <span className="font-medium">{new Date(loan.nextPaymentDate).toLocaleDateString()}</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progressPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

