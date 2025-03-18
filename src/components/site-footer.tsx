import { BarChart3 } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Finance Tracker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
