import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpIcon, ArrowDownIcon, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn, getInvestmentTypeIcon } from "@/lib/utils"
import Link from "next/link"

// Sample data - would be fetched from API in production
const INVESTMENTS_DATA = [
  {
    id: "1",
    name: "Reliance Industries",
    type: "Stock",
    investedAmount: 250000,
    currentValue: 275000,
    profitLoss: 25000,
    profitLossPercentage: 10,
  },
  {
    id: "2",
    name: "HDFC Bank",
    type: "Stock",
    investedAmount: 80000,
    currentValue: 77500,
    profitLoss: -2500,
    profitLossPercentage: -3.125,
  },
  {
    id: "3",
    name: "SBI Bluechip Fund",
    type: "Mutual Fund",
    investedAmount: 45000,
    currentValue: 52000,
    profitLoss: 7000,
    profitLossPercentage: 15.56,
  },
  {
    id: "4",
    name: "Government Bond 2025",
    type: "Bond",
    investedAmount: 100000,
    currentValue: 102000,
    profitLoss: 2000,
    profitLossPercentage: 2,
  },
  {
    id: "5",
    name: "ICICI Bank FD",
    type: "Fixed Deposit",
    investedAmount: 100000,
    currentValue: 106500,
    profitLoss: 6500,
    profitLossPercentage: 6.5,
  },
]

export default async function Page() {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit & Loss Breakdown</CardTitle>
        <CardDescription>Detailed performance of your individual investments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Investment</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Invested Amount</TableHead>
                  <TableHead className="text-right">Current Value</TableHead>
                  <TableHead className="text-right">Profit/Loss</TableHead>
                  <TableHead className="text-right">Growth %</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {INVESTMENTS_DATA.map((investment) => (
                  <TableRow key={investment.id}>
                    <TableCell className="font-medium">{investment.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getInvestmentTypeIcon(investment.type)}
                        <span>{investment.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">₹{investment.investedAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">₹{investment.currentValue.toLocaleString()}</TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-medium",
                        investment.profitLoss >= 0 ? "text-green-500" : "text-red-500",
                      )}
                    >
                      {investment.profitLoss >= 0 ? "+" : ""}₹{investment.profitLoss.toLocaleString()}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-medium",
                        investment.profitLossPercentage >= 0 ? "text-green-500" : "text-red-500",
                      )}
                    >
                      {investment.profitLossPercentage >= 0 ? (
                        <ArrowUpIcon className="mr-1 h-3 w-3 inline" />
                      ) : (
                        <ArrowDownIcon className="mr-1 h-3 w-3 inline" />
                      )}
                      {Math.abs(investment.profitLossPercentage).toFixed(2)}%
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/portfolio/transactions?investment=${investment.id}`}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Details
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}