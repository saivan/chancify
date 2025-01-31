'use client'
import { DataTable } from "@repo/components"
import { SortingState } from "@tanstack/react-table"
import { History } from "@/models/History"
import { } from 'react'
import { dateFrom24Hour } from "@repo/utilities"


export function HistoryList() {

  const rowActions = [{
    label: 'View Details',
    onClick: (history: History) => console.log('View history', history)
  }]

  return (
    <DataTable<History>
      className="rounded-none border-x-0 border-b-0 relative"
      items={fetchDataGenerator}
      url={history => `/history/${history.id}`}
      columns={[{
        value: {
          text: history => new Date(history.date).toLocaleDateString(),
          subtext: history => new Date(history.date).toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
        label: 'Date',
        sortable: true
      }, {
        value: history => history.prize.name,
        label: 'Prize'
      }, {
        label: 'Customer',
        value: {
          text: history => history.customer.name,
          subtext: history => history.customer.email,
        },
      }, {
        value: 'status',
        label: 'Status',
        sortable: true,
        display: {
          type: 'badge',
          variant: history => history.status === 'claimed' ? 'default' : 'outline'
        },
      }
      ]}
      rowActions={rowActions}
    />
  )



  async function* fetchDataGenerator(sorting: SortingState) {
    let historyItems: History[] = [{
      id: "1",
      date: "2025-01-15T14:30:00Z",
      status: "claimed",
      prize: {
        id: "101",
        name: "Gift Card",
        chance: 0.05,
      },
      customer: {
        id: "201",
        name: "John Doe",
        email: "john.doe@example.com",
        address: "123 Main St, Sydney, NSW",
        phone: "0412345678",
        details: { age: "30", occupation: "Engineer" },
      },
    }, {
      id: "2",
      date: "2025-01-16T09:45:00Z",
      status: "unclaimed",
      prize: {
        id: "102",
        name: "Smartphone",
        chance: 0.01,
      },
      customer: {
        id: "202",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        address: "456 High St, Melbourne, VIC",
        phone: "0498765432",
        details: { age: "28", occupation: "Designer" },
      },
    }, {
      id: "3",
      date: "2025-01-17T11:20:00Z",
      status: "claimed",
      prize: {
        id: "103",
        name: "Vacation Package",
        chance: 0.02,
      },
      customer: {
        id: "203",
        name: "Alice Brown",
        email: "alice.brown@example.com",
        address: "789 Park Ave, Brisbane, QLD",
        phone: "0423456789",
        details: { age: "35", occupation: "Teacher" },
      },
    }, {
      id: "4",
      date: "2025-01-18T16:10:00Z",
      status: "unclaimed",
      prize: {
        id: "104",
        name: "Laptop",
        chance: 0.03,
      },
      customer: {
        id: "204",
        name: "Bob White",
        email: "bob.white@example.com",
        address: "321 Elm St, Perth, WA",
        phone: "0411122233",
        details: { age: "42", occupation: "Manager" },
      },
    }, {
      id: "5",
      date: "2025-01-19T10:00:00Z",
      status: "claimed",
      prize: {
        id: "105",
        name: "Headphones",
        chance: 0.07,
      },
      customer: {
        id: "205",
        name: "Charlie Green",
        email: "charlie.green@example.com",
        address: "654 Oak Rd, Adelaide, SA",
        phone: "0433445566",
        details: { age: "29", occupation: "Musician" },
      },
    }, {
      id: "6",
      date: "2025-01-20T13:50:00Z",
      status: "unclaimed",
      prize: {
        id: "106",
        name: "Concert Tickets",
        chance: 0.04,
      },
      customer: {
        id: "206",
        name: "Diana Blue",
        email: "diana.blue@example.com",
        address: "987 Pine St, Canberra, ACT",
        phone: "0455667788",
        details: { age: "33", occupation: "Photographer" },
      },
    }, {
      id: "7",
      date: "2025-01-21T15:25:00Z",
      status: "claimed",
      prize: {
        id: "107",
        name: "Fitness Tracker",
        chance: 0.08,
      },
      customer: {
        id: "207",
        name: "Edward Black",
        email: "edward.black@example.com",
        address: "234 Cedar St, Hobart, TAS",
        phone: "0466778899",
        details: { age: "40", occupation: "Chef" },
      },
    }, {
      id: "8",
      date: "2025-01-22T17:35:00Z",
      status: "unclaimed",
      prize: {
        id: "108",
        name: "E-Reader",
        chance: 0.06,
      },
      customer: {
        id: "208",
        name: "Fiona Red",
        email: "fiona.red@example.com",
        address: "567 Birch St, Darwin, NT",
        phone: "0412233445",
        details: { age: "27", occupation: "Writer" },
      },
    }, {
      id: "9",
      date: "2025-01-23T12:15:00Z",
      status: "claimed",
      prize: {
        id: "109",
        name: "Coffee Maker",
        chance: 0.09,
      },
      customer: {
        id: "209",
        name: "George Yellow",
        email: "george.yellow@example.com",
        address: "890 Maple St, Cairns, QLD",
        phone: "0422334455",
        details: { age: "36", occupation: "Barista" },
      },
    }, {
      id: "10",
      date: "2025-01-24T08:50:00Z",
      status: "unclaimed",
      prize: {
        id: "110",
        name: "Tablet",
        chance: 0.05,
      },
      customer: {
        id: "210",
        name: "Hannah Grey",
        email: "hannah.grey@example.com",
        address: "123 Spruce St, Gold Coast, QLD",
        phone: "0477889900",
        details: { age: "31", occupation: "Artist" },
      },
    }]

    if (sorting.length > 0) {
      const { id, desc } = sorting[0]
      historyItems = [...historyItems].sort((a, b) => {
        const aValue = a[id as keyof History]
        const bValue = b[id as keyof History]
        return desc
          ? String(bValue).localeCompare(String(aValue))
          : String(aValue).localeCompare(String(bValue))
      })
    }

    yield historyItems
  }
}
