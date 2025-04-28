import { Offline } from "@/components/offline"

export const metadata = {
  title: "You're Offline | Expense Tracker",
  description: "You're currently offline. Please check your internet connection.",
}

export default function OfflinePage() {
  return <Offline />
}
