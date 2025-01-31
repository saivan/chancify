'use client'
import { User } from "@/models/User"
import { DataTable } from "@repo/components"
import { SortingState } from "@tanstack/react-table"
import {} from 'react'


export function UserList() {
  async function* fetchDataGenerator(sorting: SortingState) {
    let users: User[] = [
      { id: '1', name: "John Smith", email: "john@smith.com", role: 'admin' },
      { id: '2', name: "Jane Doe", email: "jane@doe.org", role: 'editor' },
      { id: '3', name: "Alice Wonderland", email: "alice@wonderland.org", role: 'viewer' },
    ]

    if (sorting.length > 0) {
      const { id, desc } = sorting[0]
      users = [...users].sort((a, b) => {
        const aValue = a[id as keyof User]
        const bValue = b[id as keyof User]
        return desc 
          ? String(bValue).localeCompare(String(aValue))
          : String(aValue).localeCompare(String(bValue))
      })
    }

    yield users
  }


  return (
    <DataTable<User>
      className="border-none"
      items={fetchDataGenerator}
      columns={[
        { value: 'name' as const, label: 'Name', sortable: true },
        { value: 'email' as const, label: 'Email', sortable: true },
        { value: 'role' as const, label: 'Role' }
      ]}
      rowActions={[{
        label: 'Delete User',
        onClick: (user: User) => console.log('Delete user', user)
      }]}
    />
  )
}
