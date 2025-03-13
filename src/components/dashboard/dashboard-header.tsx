import type React from 'react';
interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({ heading, text, children }: DashboardHeaderProps) {
  return (
    <div className="sm:px-2 pb-4">
      <div className="flex items-start sm:items-center justify-between pb-1.5">
        <div className="grid gap-1">
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl">{heading}</h1>
        </div>
        <div className="grid auto-cols-max grid-flow-col gap-2 sm:gap-4 items-center">{children}</div>
      </div>
      {text && <p className="text-sm md:text-base lg:text-lg text-muted-foreground">{text}</p>}
    </div>
  );
}
