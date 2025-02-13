'use client'
import type { CampaignType } from "@/models/Campaign"
import type { HistoryType } from "@/models/History"
import { Badge, DataTable } from "@repo/components"
import type { SortingState } from "@tanstack/react-table"
import { } from 'react'
import { toast } from "sonner"
import { useDashboard } from "../controller"
import { fetchHistory } from "../serverActions"


export function HistoryList({ campaigns }: { campaigns: CampaignType[] }) {
  const { resolveHistoryLink, deleteHistory } = useDashboard()

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
        value: {
          text: history => history?.prize?.name || "(Unclaimed Prize)",
          subtext: history => {
            const campaign = campaigns.find(campaign => campaign.id === history.campaignId)
            return campaign?.action.label || "(No Action)"
          },
        },
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
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick: async (history: HistoryType) => {
          const link = await resolveHistoryLink(history.id)
          if (link == null) {
            toast.error("No link found for this entry")
            return
          }
          window.open(link, "_blank");
        }
      }, {
        label: 'Delete Entry',
        onClick: (history: HistoryType) => { deleteHistory(history.id) }
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
