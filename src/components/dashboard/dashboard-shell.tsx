import type React from 'react';
interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-4 pt-4 sm:pb-6 sm:pt-6 md:py-8">{children}</div>;
}
