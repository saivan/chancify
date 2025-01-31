"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useInView } from "react-intersection-observer"
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
  Badge,
} from "@repo/components"
import Link from "next/link"

type ComplexColumnKey<T> = {
  text: keyof T | ((item: T) => any)
  subtext: keyof T | ((item: T) => any)
}

type Column<T> = {
  value: keyof T | ((item: T) => any) | ComplexColumnKey<T>
  label: string
  display?: {
    type: 'badge'
    variant?: (item: T) => 'default' | 'secondary' | 'outline' | 'destructive'
  }
  sortable?: boolean
}

export function DataTable<T extends { id: string }>({
  items,
  columns,
  rowActions,
  url,
  selectable = false,
  className,
}: {
  className: string
  items: (sorting: SortingState) => AsyncGenerator<T[]>
  columns: Column<T>[]
  url?: (item: T) => string | undefined
  rowActions: {
    label: string
    onClick: (item: T) => void
  }[]
  selectable?: boolean
}) {
  const [data, setData] = React.useState<T[]>([])
  const [loading, setLoading] = React.useState(false)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const { ref, inView } = useInView()

  const generatorRef = React.useRef<AsyncGenerator<T[]> | null>(null)
  const loadingRef = React.useRef(false)
  const existingIds = React.useRef(new Set<string>())

  const getNestedValue = (obj: any, path: string | ((item: any) => any)) => {
    if (typeof path === 'function') {
      return path(obj)
    }
    return path.split('.').reduce((o, i) => o?.[i], obj)
  }

  React.useEffect(() => {
    generatorRef.current = items(sorting)
    setData([])
    existingIds.current.clear()
    loadingRef.current = false
    fetchNextPage()
  }, [sorting, items])

  const fetchNextPage = React.useCallback(async () => {
    if (loadingRef.current || !generatorRef.current) return

    loadingRef.current = true
    setLoading(true)

    try {
      const result = await generatorRef.current.next()
      if (!result.done) {
        const newItems = result.value.filter(item => {
          if (existingIds.current.has(item.id)) {
            return false
          }
          existingIds.current.add(item.id)
          return true
        })
        setData(prev => [...prev, ...newItems])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (inView && !loadingRef.current) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage])

  const tableColumns = React.useMemo(() => {
    const cols: ColumnDef<T>[] = []

    if (selectable) {
      cols.push({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
      })
    }

    cols.push(
      ...columns.map(col => ({
        accessorFn: (row: any) => {
          if (typeof col.value === 'object') {
            return getNestedValue(row, col.value.text as string | ((item: T) => any))
          }
          return getNestedValue(row, col.value as string | ((item: T) => any))
        },
        id: typeof col.value === 'object' ? col.value.text as string : col.value as string,
        header: ({ column }: { column: any }) =>
          col.sortable ? (
            <Button
              variant="ghost"
              onClick={() => {
                const currentSort = column.getIsSorted()
                if (currentSort === false) {
                  column.toggleSorting(false)
                } else if (currentSort === "asc") {
                  column.toggleSorting(true)
                } else {
                  column.clearSorting()
                }
              }}
            >
              {col.label}
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          ) : col.label,
        cell: ({ row }: { row: any }) => {
          if (col.display?.type === 'badge') {
            const variant = col.display.variant?.(row.original) || 'default'
            return (
              <Badge variant={variant}>
                {getNestedValue(row.original, col.value as string | ((item: T) => any))}
              </Badge>
            )
          }
          if (typeof col.value === 'object') {
            return (
              <div className="flex flex-col">
                <span className="font-medium">
                  {getNestedValue(row.original, col.value.text as string | ((item: T) => any))}
                </span>
                <span className="text-sm text-gray-500">
                  {getNestedValue(row.original, col.value.subtext as string | ((item: T) => any))}
                </span>
              </div>
            )
          }
          return getNestedValue(row.original, col.value as string | ((item: T) => any))
        },
      }))
    )

    if (rowActions.length > 0 || url) {
      cols.push({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {url && url(row.original) && (
              <Button asChild variant='outline' size="sm">
                <Link href={url(row.original)} >
                  Visit
                </Link>
              </Button>
            )}
            {rowActions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {rowActions.map((action, i) => (
                    <DropdownMenuItem
                      key={i}
                      onClick={() => action.onClick(row.original)}
                    >
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )
      })
    }

    return cols
  }, [columns, rowActions, url, selectable])

  const table = useReactTable({
    data,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <Table className={cn("rounded-md border overflow-auto h-max-full border-separate border-spacing-0", className)}>
      <TableHeader className="sticky top-0 bg-slate-50">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="border-b border-slate-200">
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="h-12 px-4 align-middle [&:has([role=checkbox])]:pr-0"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
            className="border-b border-slate-200"
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
              >
                {flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
        <TableRow ref={ref}>
          <TableCell
            colSpan={tableColumns.length}
            className="h-8 p-4 align-middle"
          >
            {loading && <div className="text-center">Loading more...</div>}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
