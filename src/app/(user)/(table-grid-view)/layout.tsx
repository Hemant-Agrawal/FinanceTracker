import type React from 'react';

import { TableGridProvider } from './provider';

export default async function TableGridLayout({
  children,
  // searchParams,
}: {
  children: React.ReactNode;
  // searchParams: Promise<{ [key: string]: string | string[] }>;
}) {
  return (
    <TableGridProvider initialData={[]}>
      {/* <Filters filters={[]} /> */}
      {children}
      {/* <Pagination pagination={[]} /> */}
    </TableGridProvider>
  );
}
