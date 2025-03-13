'use client';

import { Trash, Download, Tag, Edit } from 'lucide-react';
import { Button } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { useTableGridContext } from './provider';

export function BulkActionsMenu() {
  const { selectedItems, handleBulkDelete } = useTableGridContext();
  if (selectedItems.length === 0) return null;
  return (
    <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
      <p className="text-sm font-medium">
        {selectedItems.length} {selectedItems.length === 1 ? 'transaction' : 'transactions'} selected
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleBulkDelete} className="text-destructive">
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              More Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit Selected
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Tag className="h-4 w-4 mr-2" />
              Apply Tags
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              Export Selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
