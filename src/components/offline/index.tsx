"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Wifi, WifiOff, RefreshCw, Home } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { OfflineAnimation } from "./offline-animation"

export function Offline() {
  const [isOnline, setIsOnline] = useState(true)
  const [isRetrying, setIsRetrying] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine)

    // Add event listeners for online/offline events
    const handleOnline = () => {
      setIsOnline(true)
      toast({
        title: "You're back online!",
        description: "Your internet connection has been restored.",
        variant: "default",
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast({
        title: "You're offline",
        description: "Please check your internet connection.",
        variant: "destructive",
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [toast])

  const handleRetry = () => {
    setIsRetrying(true)

    // Simulate checking for connection
    setTimeout(() => {
      if (navigator.onLine) {
        setIsOnline(true)
        toast({
          title: "Connection restored!",
          description: "You're back online now.",
        })
      } else {
        toast({
          title: "Still offline",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
        })
      }
      setIsRetrying(false)
    }, 1500)
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md border-2 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-muted p-3 w-12 h-12 flex items-center justify-center">
            {isOnline ? (
              <Wifi className="h-6 w-6 text-primary animate-pulse" />
            ) : (
              <WifiOff className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <CardTitle className="text-2xl">{isOnline ? "You're back online!" : "You're offline"}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <OfflineAnimation />

          <p className="text-muted-foreground">
            {isOnline
              ? "Your internet connection has been restored. You can continue using the app."
              : "Don't worry! You can still access some features of the app while offline."}
          </p>

          {!isOnline && (
            <div className="bg-muted/50 rounded-lg p-4 mt-4">
              <h3 className="font-medium mb-2">While you&apos;re offline, you can:</h3>
              <ul className="text-sm text-left space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5">•</span>
                  <span>View previously loaded transactions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5">•</span>
                  <span>Create new transactions (they&apos;ll sync when you&apos;re back online)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5">•</span>
                  <span>Access your budget summaries</span>
                </li>
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant={isOnline ? "default" : "outline"}
            className="w-full sm:w-auto"
            onClick={handleRetry}
            disabled={isRetrying}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRetrying ? "animate-spin" : ""}`} />
            {isRetrying ? "Checking..." : "Check connection"}
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button variant="default" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Go to homepage
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
