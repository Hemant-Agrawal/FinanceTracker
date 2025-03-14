import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Lightbulb, TrendingUp, Clock, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const getIcon = (type: string) => {
  switch (type) {
    case "maturity":
      return <Clock className="h-5 w-5" />
    case "diversification":
      return <AlertTriangle className="h-5 w-5" />
    case "opportunity":
      return <TrendingUp className="h-5 w-5" />
    default:
      return <Lightbulb className="h-5 w-5" />
  }
}

const getAlertVariant = (type: string) => {
  switch (type) {
    case "maturity":
      return "default"
    case "diversification":
      return "warning"
    case "opportunity":
      return "success"
    default:
      return "default"
  }
}

const Recommendations = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const recommendations = [
    {
      id: "1",
      title: "FD Maturity Alert",
      description: "Your ICICI Bank FD is maturing in 15 days. Consider reinvesting in high-yield bonds.",
      type: "maturity",
      action: "View Options",
      link: "/portfolio/investments?type=Bond",
    },
    {
      id: "2",
      title: "Portfolio Diversification",
      description: "Your stock allocation is high (65%). Consider diversifying by adding more debt investments.",
      type: "diversification",
      action: "Explore Bonds",
      link: "/portfolio/investments?type=Bond",
    },
    {
      id: "3",
      title: "SIP Opportunity",
      description: "Market indices are down 5% this week. Good time to increase your SIP investments.",
      type: "opportunity",
      action: "Start SIP",
      link: "/portfolio/investments?type=Mutual+Fund",
    },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
          Investment Recommendations
        </CardTitle>
        <CardDescription>AI-powered suggestions to optimize your portfolio</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((recommendation) => (
          <Alert key={recommendation.id} variant={getAlertVariant(recommendation.type)}>
            <div className="flex items-start">
              {getIcon(recommendation.type)}
              <div className="ml-4 flex-1">
                <AlertTitle>{recommendation.title}</AlertTitle>
                <AlertDescription className="mt-1">{recommendation.description}</AlertDescription>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link href={recommendation.link}>{recommendation.action}</Link>
                </Button>
              </div>
            </div>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
};

export default Recommendations;
