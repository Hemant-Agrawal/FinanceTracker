'use client';

import { ObjectId, WithId } from 'mongodb';
import { createContext, useContext, useState, ReactNode } from 'react';

// Define context type
interface TableGridContextType<T extends { _id: string | ObjectId }> {
  // data: T[];
  // setData: (data: T[]) => void;
  selectedItems: string[];
  handleSelectItem: (id: string, isSelected: boolean) => void;
  handleSelectAll: (isSelected: boolean, data: T[]) => void;
  handleBulkDelete: () => void;

  isDetailsModalOpen: boolean;
  setIsDetailsModalOpen: (isOpen: boolean) => void;
  currentItem: T | null;
  handleViewItem: (item: T) => void;
}

// Create context with default values
const TableGridContext = createContext<TableGridContextType<any>>({
  // data: [],
  // setData: () => {},
  selectedItems: [],
  handleSelectItem: () => {},
  handleSelectAll: () => {},
  handleBulkDelete: () => {},

  isDetailsModalOpen: false,
  setIsDetailsModalOpen: () => {},
  currentItem: null,
  handleViewItem: () => {},
});

// Provider Props
interface TableGridProviderProps<T> {
  children: ReactNode;
  initialData: T[];
}

// Provider Component
export const TableGridProvider = <T extends WithId<{}>>({
  children,
  initialData = [],
}: TableGridProviderProps<T>) => {
  // const [data, setData] = useState<T[]>(initialData);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any | null>(null);

  // View item details
  const handleViewItem = (item: T) => {
    setCurrentItem(item);
    setIsDetailsModalOpen(true);
  };

  // Select/Deselect single item
  const handleSelectItem = (id: string, isSelected: boolean) => {
    setSelectedItems(prev => (isSelected ? [...prev, id] : prev.filter(itemId => itemId !== id)));
  };

  // Select/Deselect all items
  const handleSelectAll = (isSelected: boolean, data: T[]) => {
    setSelectedItems(isSelected ? data.map(item => item._id.toString()) : []);
  };

  // Bulk delete selected items
  const handleBulkDelete = () => {
    setSelectedItems([]);
  };

  return (
    <TableGridContext.Provider
      value={{
        // data,
        // setData,
        selectedItems,
        handleSelectItem,
        handleSelectAll,
        handleBulkDelete,
        isDetailsModalOpen,
        setIsDetailsModalOpen,
        currentItem,
        handleViewItem,
      }}
    >
      {children}
    </TableGridContext.Provider>
  );
};

// Custom hook to use the context
export const useTableGridContext = () => useContext(TableGridContext);

export function withDataProvider<T extends WithId<{}>>(Component: React.ComponentType, initialData: T[]) {
  return function WrappedComponent(props: any) {
    return (
      <TableGridProvider initialData={initialData}>
        <Component {...props} />
      </TableGridProvider>
    );
  };
}
