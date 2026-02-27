/**
 * DataTable Component
 *
 * Generic, reusable table component with:
 * - Pagination support
 * - Sorting
 * - Row selection
 * - Loading states
 * - Empty states
 * - Responsive design
 * - Type-safe with generics
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/lib/utils/cn';

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

// ===========================================
// TYPES
// ===========================================

export interface Column<T> {
  /** Unique identifier for the column */
  id: string;
  /** Display header */
  header: string;
  /** Accessor function or key */
  accessor: keyof T | ((row: T) => React.ReactNode);
  /** Cell renderer (optional) */
  cell?: (row: T) => React.ReactNode;
  /** Enable sorting for this column */
  sortable?: boolean;
  /** Column width (CSS value) */
  width?: string;
  /** Column alignment */
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  /** Array of data items */
  data: T[];
  /** Column definitions */
  columns: Column<T>[];
  /** Unique key for each row */
  keyExtractor: (row: T) => string;
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Enable row selection */
  selectable?: boolean;
  /** Selected row keys */
  selectedKeys?: Set<string>;
  /** Selection change handler */
  onSelectionChange?: (keys: Set<string>) => void;
  /** Row click handler */
  onRowClick?: (row: T) => void;
  /** Pagination component */
  pagination?: React.ReactNode;
  /** Additional actions per row */
  actions?: (row: T) => React.ReactNode;
  /** Compact mode */
  compact?: boolean;
  /** Custom row class name */
  rowClassName?: (row: T) => string;
}

// ===========================================
// COMPONENT
// ===========================================

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  loading = false,
  emptyMessage = 'No data available',
  selectable = false,
  selectedKeys = new Set(),
  onSelectionChange,
  onRowClick,
  pagination,
  actions,
  compact = false,
  rowClassName,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Handle column sort
  const handleSort = (columnId: string, sortable: boolean = false) => {
    if (!sortable) return;

    if (sortColumn === columnId) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  // Handle row selection
  const handleSelectRow = (key: string) => {
    if (!onSelectionChange) return;

    const newSelection = new Set(selectedKeys);
    if (newSelection.has(key)) {
      newSelection.delete(key);
    } else {
      newSelection.add(key);
    }
    onSelectionChange(newSelection);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (!onSelectionChange) return;

    if (selectedKeys.size === data.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(data.map(keyExtractor)));
    }
  };

  // Render cell content
  const renderCell = (row: T, column: Column<T>) => {
    if (column.cell) {
      return column.cell(row);
    }

    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }

    return String(row[column.accessor] ?? '');
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-(--color-border)">
            <TableHeader
              columns={columns}
              selectable={selectable}
              allSelected={false}
              onSelectAll={handleSelectAll}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <tbody className="bg-(--color-bg) divide-y divide-(--color-border)">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  {selectable && (
                    <td className="px-6 py-4">
                      <div className="h-4 w-4 bg-(--color-bg-muted) rounded animate-pulse" />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.id} className="px-6 py-4">
                      <div className="h-4 bg-(--color-bg-muted) rounded animate-pulse" />
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4">
                      <div className="h-4 w-16 bg-(--color-bg-muted) rounded animate-pulse" />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="w-full">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-(--color-border)">
            <TableHeader
              columns={columns}
              selectable={selectable}
              allSelected={false}
              onSelectAll={handleSelectAll}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          </table>
        </div>
        <div className="text-center py-12 text-(--color-fg-muted)">{emptyMessage}</div>
      </div>
    );
  }

  const allSelected = selectedKeys.size === data.length && data.length > 0;

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-(--color-border)">
          <TableHeader
            columns={columns}
            selectable={selectable}
            allSelected={allSelected}
            onSelectAll={handleSelectAll}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            actions={!!actions}
          />
          <tbody className="bg-(--color-bg) divide-y divide-(--color-border)">
            {data.map((row) => {
              const key = keyExtractor(row);
              const isSelected = selectedKeys.has(key);
              const customClass = rowClassName ? rowClassName(row) : '';

              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(row)}
                  className={`
                    ${compact ? 'text-sm' : ''}
                    ${onRowClick ? 'cursor-pointer hover:bg-(--color-bg-hover)' : ''}
                    ${isSelected ? 'bg-(--color-primary)/5' : ''}
                    ${customClass}
                  `}
                >
                  {selectable && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(key)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Select row ${key}`}
                        className="h-4 w-4 text-(--color-primary) focus:ring-(--color-primary) border-(--color-border) rounded"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={cn(
                        'px-6 whitespace-nowrap',
                        compact ? 'py-2' : 'py-4',
                        alignClasses[column.align || 'left']
                      )}
                      style={{ width: column.width }}
                    >
                      {renderCell(row, column)}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination && <div className="mt-4 flex items-center justify-between">{pagination}</div>}
    </div>
  );
}

// ===========================================
// TABLE HEADER
// ===========================================

interface TableHeaderProps<T> {
  columns: Column<T>[];
  selectable: boolean;
  allSelected: boolean;
  onSelectAll: () => void;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  onSort: (columnId: string, sortable: boolean) => void;
  actions?: boolean;
}

function TableHeader<T>({
  columns,
  selectable,
  allSelected,
  onSelectAll,
  sortColumn,
  sortDirection,
  onSort,
  actions = false,
}: TableHeaderProps<T>) {
  return (
    <thead className="bg-(--color-bg-muted)">
      <tr>
        {selectable && (
          <th scope="col" className="px-6 py-3 text-left">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={onSelectAll}
              aria-label="Select all rows"
              className="h-4 w-4 text-(--color-primary) focus:ring-(--color-primary) border-(--color-border) rounded"
            />
          </th>
        )}
        {columns.map((column) => (
          <th
            key={column.id}
            scope="col"
            className={cn(
              'px-6 py-3 text-xs font-medium text-(--color-fg-muted) uppercase tracking-wider',
              alignClasses[column.align || 'left'],
              column.sortable && 'cursor-pointer hover:bg-(--color-bg-hover)'
            )}
            onClick={() => onSort(column.id, column.sortable || false)}
            style={{ width: column.width }}
          >
            <div className="flex items-center gap-2">
              <span>{column.header}</span>
              {column.sortable && (
                <span className="text-(--color-fg-subtle)">
                  {sortColumn === column.id ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                </span>
              )}
            </div>
          </th>
        ))}
        {actions && (
          <th
            scope="col"
            className="px-6 py-3 text-right text-xs font-medium text-(--color-fg-muted) uppercase tracking-wider"
          >
            Actions
          </th>
        )}
      </tr>
    </thead>
  );
}

// ===========================================
// PAGINATION COMPONENT
// ===========================================

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [20, 50, 100],
  hasMore,
  onLoadMore,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || Infinity);

  return (
    <nav className="flex items-center justify-between" aria-label="Pagination">
      <div className="flex items-center gap-4">
        {totalItems !== undefined && (
          <span className="text-sm text-(--color-fg)">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </span>
        )}

        {onPageSizeChange && (
          <select
            value={itemsPerPage}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Items per page"
            className="border-(--color-border) rounded-md text-sm bg-(--color-bg) text-(--color-fg)"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!hasMore && (
          <>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="px-3 py-1 border border-(--color-border) rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-(--color-bg-hover) bg-(--color-bg) text-(--color-fg)"
            >
              Previous
            </button>

            {totalPages > 0 && (
              <span className="text-sm text-(--color-fg)">
                Page {currentPage} of {totalPages}
              </span>
            )}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="px-3 py-1 border border-(--color-border) rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-(--color-bg-hover) bg-(--color-bg) text-(--color-fg)"
            >
              Next
            </button>
          </>
        )}

        {hasMore && onLoadMore && (
          <button
            onClick={onLoadMore}
            className="px-4 py-2 bg-(--color-primary) text-(--color-primary-fg) rounded-md text-sm hover:bg-(--color-primary-hover)"
          >
            Load More
          </button>
        )}
      </div>
    </nav>
  );
}

DataTable.displayName = 'DataTable';
Pagination.displayName = 'Pagination';
