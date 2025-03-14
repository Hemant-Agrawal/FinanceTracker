import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getInvestmentTypeIcon } from "@/lib/utils"
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, TrendingDown } from "lucide-react"

// Sample data - would be fetched from API in production
const TOP_GAINERS = [
  {
    id: "1",
    name: "Tata Motors",
    type: "Stock",
    profitLossPercentage: 15.56,
    profitLoss: 14000,
    period: "This Month",
  },
  {
    id: "3",
    name: "SBI Bluechip Fund",
    type: "Mutual Fund",
    profitLossPercentage: 15.56,
    profitLoss: 7000,
    period: "This Month",
  },
  {
    id: "6",
    name: "Axis Midcap Fund",
    type: "Mutual Fund",
    profitLossPercentage: 13.33,
    profitLoss: 4000,
    period: "This Month",
  },
]

const TOP_LOSERS = [
  {
    id: "2",
    name: "HDFC Bank",
    type: "Stock",
    profitLossPercentage: -3.125,
    profitLoss: -2500,
    period: "This Month",
  },
  {
    id: "11",
    name: "Bitcoin ETF",
    type: "ETF",
    profitLossPercentage: -8.5,
    profitLoss: -4250,
    period: "This Week",
  },
]

export default async function TopPerformers() {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performers</CardTitle>
        <CardDescription>Your best and worst performing investments</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gainers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="gainers" className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
              Top Gainers
            </TabsTrigger>
            <TabsTrigger value="losers" className="flex items-center">
              <TrendingDown className="mr-2 h-4 w-4 text-red-500" />
              Top Losers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gainers">
            <div className="grid gap-4 md:grid-cols-3">
              {TOP_GAINERS.map((investment) => (
                <Card key={investment.id} className="bg-green-50/30 dark:bg-green-950/10">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        {getInvestmentTypeIcon(investment.type)}
                        <span className="font-medium">{investment.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{investment.period}</div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-green-600 font-bold flex items-center">
                        <ArrowUpIcon className="mr-1 h-4 w-4" />
                        {investment.profitLossPercentage.toFixed(2)}%
                      </div>
                      <div className="text-green-600">+₹{investment.profitLoss.toLocaleString()}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="losers">
            <div className="grid gap-4 md:grid-cols-3">
              {TOP_LOSERS.map((investment) => (
                <Card key={investment.id} className="bg-red-50/30 dark:bg-red-950/10">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        {getInvestmentTypeIcon(investment.type)}
                        <span className="font-medium">{investment.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{investment.period}</div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-red-600 font-bold flex items-center">
                        <ArrowDownIcon className="mr-1 h-4 w-4" />
                        {Math.abs(investment.profitLossPercentage).toFixed(2)}%
                      </div>
                      <div className="text-red-600">-₹{Math.abs(investment.profitLoss).toLocaleString()}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

