"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ArrowUpIcon, ArrowDownIcon, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

// Sample data for demonstration
const SYNC_RESULTS = {
  updatedAt: new Date(),
  totalInvestments: 10,
  changedInvestments: 8,
  increases: [
    {
      id: "1",
      name: "Reliance Industries",
      previousValue: 275000,
      currentValue: 282500,
      change: 7500,
      changePercent: 2.73,
    },
    { id: "3", name: "SBI Bluechip Fund", previousValue: 52000, currentValue: 54600, change: 2600, changePercent: 5 },
    { id: "6", name: "Axis Midcap Fund", previousValue: 34000, currentValue: 35700, change: 1700, changePercent: 5 },
    { id: "7", name: "Tata Motors", previousValue: 104000, currentValue: 109200, change: 5200, changePercent: 5 },
    { id: "10", name: "Gold ETF", previousValue: 210000, currentValue: 214200, change: 4200, changePercent: 2 },
  ],
  decreases: [
    { id: "2", name: "HDFC Bank", previousValue: 77500, currentValue: 76725, change: -775, changePercent: -1 },
    {
      id: "4",
      name: "Government Bond 2025",
      previousValue: 102000,
      currentValue: 101490,
      change: -510,
      changePercent: -0.5,
    },
    { id: "11", name: "Bitcoin ETF", previousValue: 50000, currentValue: 46000, change: -4000, changePercent: -8 },
  ],
  unchanged: [
    { id: "5", name: "ICICI Bank FD", previousValue: 106500, currentValue: 106500, change: 0, changePercent: 0 },
    { id: "9", name: "Corporate Bond 2024", previousValue: 102500, currentValue: 102500, change: 0, changePercent: 0 },
  ],
  portfolioValueBefore: 1250000,
  portfolioValueAfter: 1275000,
  portfolioChange: 25000,
  portfolioChangePercent: 2,
}

interface SyncModalProps {
  // children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SyncModal({ open, onOpenChange }: SyncModalProps) {
  const [syncState, setSyncState] = useState<"idle" | "syncing" | "complete" | "error">("idle")
  const [progress, setProgress] = useState(0)
  const [syncResults, setSyncResults] = useState<typeof SYNC_RESULTS | null>(null)
  const isMobile = useMediaQuery("(max-width: 640px)")
  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSyncState("syncing")
      setProgress(0)
      setSyncResults(null)

      // Simulate sync progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 15
          return newProgress >= 100 ? 100 : newProgress
        })
      }, 600)

      // Simulate sync completion after 4 seconds
      const timeout = setTimeout(() => {
        clearInterval(interval)
        setProgress(100)
        setSyncResults(SYNC_RESULTS)
        setSyncState("complete")
      }, 4000)

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    }
  }, [open])

  const handleClose = () => {
    if (syncState !== "syncing") {
      onOpenChange(false)
    }
  }

  const handleRetry = () => {
    setSyncState("syncing")
    setProgress(0)
    setSyncResults(null)

    // Simulate sync progress again
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15
        return newProgress >= 100 ? 100 : newProgress
      })
    }, 600)

    // Simulate sync completion or error
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setSyncResults(SYNC_RESULTS)
      setSyncState("complete")
    }, 4000)
  }

  // Content to be displayed in both dialog and sheet
  const renderContent = () => (
    <AnimatePresence mode="wait">
      {/* Syncing State */}
      {syncState === "syncing" && (
        <motion.div
          key="syncing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-6 py-4"
        >
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground text-right">{Math.round(progress)}%</p>
          </div>

          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: isMobile ? 1.5 : 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <RefreshCw className="h-12 w-12 text-primary opacity-80" />
            </motion.div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            This may take a few moments. Please don&apos;t close this window.
          </p>
        </motion.div>
      )}

      {/* Complete State */}
      {syncState === "complete" && syncResults && (
        <motion.div
          key="complete"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-6 py-4"
        >
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            <span className="text-lg font-medium">All investments updated successfully</span>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm font-medium">Portfolio Value</p>
                <p className="text-2xl font-bold">₹{syncResults.portfolioValueAfter.toLocaleString()}</p>
              </div>
              <div className={cn("text-right", syncResults.portfolioChange >= 0 ? "text-green-500" : "text-red-500")}>
                <p className="text-sm font-medium">Change</p>
                <p className="text-xl font-bold flex items-center justify-end">
                  {syncResults.portfolioChange >= 0 ? (
                    <ArrowUpIcon className="mr-1 h-4 w-4" />
                  ) : (
                    <ArrowDownIcon className="mr-1 h-4 w-4" />
                  )}
                  {syncResults.portfolioChange >= 0 ? "+" : ""}₹{Math.abs(syncResults.portfolioChange).toLocaleString()}
                  <span className="ml-1">
                    ({syncResults.portfolioChangePercent >= 0 ? "+" : ""}
                    {syncResults.portfolioChangePercent}%)
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[50vh] md:max-h-[60vh] pr-1">
            {syncResults.increases.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-green-500 flex items-center mb-2 sticky top-0 bg-background py-1">
                  <ArrowUpIcon className="mr-1 h-4 w-4" />
                  Increased Values ({syncResults.increases.length})
                </h3>
                <div className="space-y-2">
                  {syncResults.increases.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-sm p-2 rounded-md bg-green-50 dark:bg-green-950/20"
                    >
                      <span className="font-medium">{item.name}</span>
                      <div className="text-right">
                        <div className="text-green-600 font-medium">
                          +₹{item.change.toLocaleString()} (+{item.changePercent}%)
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ₹{item.previousValue.toLocaleString()} → ₹{item.currentValue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {syncResults.decreases.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-red-500 flex items-center mb-2 sticky top-0 bg-background py-1">
                  <ArrowDownIcon className="mr-1 h-4 w-4" />
                  Decreased Values ({syncResults.decreases.length})
                </h3>
                <div className="space-y-2">
                  {syncResults.decreases.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-sm p-2 rounded-md bg-red-50 dark:bg-red-950/20"
                    >
                      <span className="font-medium">{item.name}</span>
                      <div className="text-right">
                        <div className="text-red-600 font-medium">
                          -₹{Math.abs(item.change).toLocaleString()} ({item.changePercent}%)
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ₹{item.previousValue.toLocaleString()} → ₹{item.currentValue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {syncResults.unchanged.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground flex items-center mb-2 sticky top-0 bg-background py-1">
                  Unchanged Values ({syncResults.unchanged.length})
                </h3>
                <div className="space-y-2">
                  {syncResults.unchanged.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
                      <span className="font-medium">{item.name}</span>
                      <div className="text-right">
                        <div className="text-muted-foreground">₹{item.currentValue.toLocaleString()} (0%)</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleClose}>Close</Button>
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {syncState === "error" && (
        <motion.div
          key="error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-6 py-4"
        >
          <div className="flex items-center justify-center space-x-2 text-red-500">
            <AlertCircle className="h-6 w-6" />
            <span className="text-lg font-medium">Failed to sync investment data</span>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            There was an error connecting to the market data service. Please check your internet connection and try
            again.
          </p>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleRetry}>Retry</Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Use Sheet for mobile and Dialog for desktop
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={handleClose}>
        {/* <SheetTrigger asChild>
          {children}
        </SheetTrigger> */}
        <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
          <SheetHeader className="text-left">
            <SheetTitle>
              {syncState === "syncing" && "Syncing Investment Data..."}
              {syncState === "complete" && "Sync Complete"}
              {syncState === "error" && "Sync Failed"}
            </SheetTitle>
            <SheetDescription>
              {syncState === "syncing" && "Fetching the latest market data for your investments."}
              {syncState === "complete" && `Last updated: ${syncResults?.updatedAt.toLocaleString()}`}
              {syncState === "error" && "There was an error syncing your investment data. Please try again."}
            </SheetDescription>
          </SheetHeader>
          {renderContent()}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {/* <DialogTrigger asChild>
        {children}
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {syncState === "syncing" && "Syncing Investment Data..."}
            {syncState === "complete" && "Sync Complete"}
            {syncState === "error" && "Sync Failed"}
          </DialogTitle>
          <DialogDescription>
            {syncState === "syncing" && "Fetching the latest market data for your investments."}
            {syncState === "complete" && `Last updated: ${syncResults?.updatedAt.toLocaleString()}`}
            {syncState === "error" && "There was an error syncing your investment data. Please try again."}
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  )
}
