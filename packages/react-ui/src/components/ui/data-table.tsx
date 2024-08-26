'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SeekPage } from '@activepieces/shared';

import { Button } from './button';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableFacetedFilter } from './data-table-options-filter';
import { DataTableSkeleton } from './data-table-skeleton';
import { DataTableToolbar } from './data-table-toolbar';
import { INTERNAL_ERROR_TOAST, toast } from './use-toast';

export type DataWithId = {
  id: string;
};
export type RowDataWithActions<TData extends DataWithId> = TData & {
  delete: () => void;
};

type FilterRecord<Keys extends string, F extends DataTableFilter<Keys>[]> = {
  [K in F[number] as K['accessorKey']]: K['type'] extends 'select'
    ? K['options'][number]['value'][]
    : K['options'][number]['value'];
};

export type DataTableFilter<Keys extends string> = {
  type: 'select' | 'input' | 'date';
  title: string;
  accessorKey: Keys;
  icon: React.ComponentType<{ className?: string }>;
  options: readonly {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
};

type DataTableAction<TData extends DataWithId> = (
  row: RowDataWithActions<TData>,
) => JSX.Element;

export type PaginationParams = {
  cursor?: string;
  limit?: number;
  createdAfter?: string;
  createdBefore?: string;
};

interface DataTableProps<
  TData extends DataWithId,
  TValue,
  Keys extends string,
  F extends DataTableFilter<Keys>[],
> {
  columns: ColumnDef<RowDataWithActions<TData>, TValue>[];
  fetchData: (
    filters: FilterRecord<Keys, F>,
    pagination: PaginationParams,
  ) => Promise<SeekPage<TData>>;
  onRowClick?: (
    row: RowDataWithActions<TData>,
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
  ) => void;
  filters?: [...F];
  refresh?: number;
  actions?: DataTableAction<TData>[];
}

export function DataTable<
  TData extends DataWithId,
  TValue,
  Keys extends string,
  F extends DataTableFilter<Keys>[],
>({
  columns: columnsInitial,
  fetchData,
  onRowClick,
  filters,
  refresh,
  actions = [],
}: DataTableProps<TData, TValue, Keys, F>) {
  const columns = columnsInitial.concat([
    {
      accessorKey: '__actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-end justify-end gap-4">
            {actions.map((action, index) => {
              return (
                <React.Fragment key={index}>
                  {action(row.original)}
                </React.Fragment>
              );
            })}
          </div>
        );
      },
    },
  ]);

  const [searchParams, setSearchParams] = useSearchParams();
  const startingCursor = searchParams.get('cursor') || undefined;
  const [currentCursor, setCurrentCursor] = useState<string | undefined>(
    startingCursor,
  );
  const [nextPageCursor, setNextPageCursor] = useState<string | undefined>(
    undefined,
  );
  const [previousPageCursor, setPreviousPageCursor] = useState<
    string | undefined
  >(undefined);
  const [tableData, setTableData] = useState<RowDataWithActions<TData>[]>([]);
  const [deletedRows = [], setDeletedRows] = useState<TData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDataAndUpdateState = async (params: URLSearchParams) => {
    setLoading(true);
    setTableData([]);
    try {
      const limit = params.get('limit') ?? undefined;
      const filterNames = (filters ?? []).map((filter) => filter.accessorKey);
      const paramsObject = filterNames
        .map((key) => [key, params.getAll(key)] as const)
        .reduce((acc, [key, values]) => {
          const value = values.length === 1 ? values?.[0] || undefined : values;
          if (!value) {
            return acc;
          }
          return { ...acc, [key]: value };
        }, {} as FilterRecord<Keys, F>);

      const response = await fetchData(paramsObject, {
        cursor: params.get('cursor') ?? undefined,
        limit: limit ? parseInt(limit) : undefined,
        createdAfter: params.get('createdAfter') ?? undefined,
        createdBefore: params.get('createdBefore') ?? undefined,
      });
      const newData = response.data.map((row) => ({
        ...row,
        delete: () => {
          setDeletedRows([...deletedRows, row]);
        },
      }));
      setTableData(newData);
      setNextPageCursor(response.next ?? undefined);
      setPreviousPageCursor(response.previous ?? undefined);
    } catch (error) {
      console.error(error);
      toast(INTERNAL_ERROR_TOAST);
    } finally {
      setLoading(false);
    }
  };

  const table = useReactTable({
    data: tableData,
    columns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    filters?.forEach((filter) => {
      const column = table.getColumn(filter.accessorKey);
      const values = searchParams.getAll(filter.accessorKey);
      if (column && values) {
        column.setFilterValue(values);
      }
    });
  }, []);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev);
        if (currentCursor) {
          newParams.set('cursor', currentCursor);
        }
        return newParams;
      },
      { replace: true },
    );
  }, [currentCursor]);

  useEffect(() => {
    fetchDataAndUpdateState(searchParams);
  }, [searchParams, refresh]);

  useEffect(() => {
    setTableData(
      tableData.filter(
        (row) => !deletedRows.some((deletedRow) => deletedRow.id === row.id),
      ),
    );
  }, [deletedRows]);

  return (
    <div>
      <DataTableToolbar>
        {filters &&
          filters.map((filter) => (
            <DataTableFacetedFilter
              key={filter.accessorKey}
              type={filter.type}
              column={table.getColumn(filter.accessorKey)}
              title={filter.title}
              options={filter.options}
            />
          ))}
      </DataTableToolbar>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <DataTableSkeleton />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  onClick={(e) => onRowClick?.(row.original, e)}
                  key={row.id}
                  className={onRowClick ? 'cursor-pointer' : ''}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentCursor(previousPageCursor)}
          disabled={!previousPageCursor}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentCursor(nextPageCursor)}
          disabled={!nextPageCursor}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
