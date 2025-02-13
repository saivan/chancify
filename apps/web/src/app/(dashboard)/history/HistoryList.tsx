'use client'
import { Badge, DataTable } from "@repo/components"
import { SortingState } from "@tanstack/react-table"
import { HistoryType } from "@/models/History"
import { fetchHistory } from "../serverActions"
import { } from 'react'


export function HistoryList() {
  return (
    <DataTable<HistoryType>
      className="rounded-none border-x-0 border-b-0 relative"
      items={fetchDataGenerator}
      url={history => `/history/${history.id}`}
      columns={[{
        value: {
          text: history => new Date(history.dateCreated).toLocaleDateString(),
          subtext: history => new Date(history.dateCreated).toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
        label: 'Date',
      }, {
        value: history => history?.prize?.name || "(Unclaimed Prize)",
        label: 'Prize'
      }, {
        label: 'Customer',
        value: {
          text: history => history?.customer?.name || "(No Name)",
          subtext: history => history?.customer?.email || "(No Email)",
        },
      }, {
        value: 'status',
        label: 'Status',
        display: history => (
          <Badge variant={
            history.status === 'claimed' ? 'default' 
            : history.status === 'unclaimed' ? 'outline'
            : 'secondary'}
          > {history.status} </Badge>
        ),
      }
      ]}
      rowActions={[{
        label: 'Verify Entry',
        onClick: (history: HistoryType) => console.log('Verifying Entry', history)
      }, {
        label: 'Delete Entry',
        onClick: (history: HistoryType) => console.log('Delete history', history)
      }]}
    />
  )

  async function* fetchDataGenerator(sorting: SortingState) {
    let historyItems = await fetchHistory() as Required<HistoryType>[]
    if (sorting.length > 0) {
      const { id, desc } = sorting[0]
      historyItems = [...historyItems].sort((a, b) => {
        const aValue = a[id as keyof HistoryType]
        const bValue = b[id as keyof HistoryType]
        return desc
          ? String(bValue).localeCompare(String(aValue))
          : String(aValue).localeCompare(String(bValue))
      })
    }

    yield historyItems
  }
}
