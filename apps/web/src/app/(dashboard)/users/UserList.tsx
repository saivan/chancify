'use client'
import type { UserType } from "@/models/User"
import { DataTable } from "@repo/components"
import { titleCase } from "@repo/utilities"
import type { SortingState } from "@tanstack/react-table"
import { } from 'react'
import { useDashboard } from "../controller"


export function UserList() {
  const { 
    populateOrganizationUsers, 
    updateUserRole, deleteOrganizationUser,
  } = useDashboard()
  async function* fetchDataGenerator(sorting: SortingState) {
    // Fetch the users directly
    const userData: UserType[] = await populateOrganizationUsers()
    let users = [...userData]

    // Allow for reordering
    if (sorting.length > 0) {
      const { id, desc } = sorting[0]
      users = [...users].sort((a, b) => {
        const aValue = a[id as keyof UserType]
        const bValue = b[id as keyof UserType]
        return desc
          ? String(bValue).localeCompare(String(aValue))
          : String(aValue).localeCompare(String(bValue))
      })
    }

    yield users
  }

  return (
    <div className="min-h-[200px]">
      {/* @ts-ignore - we know that id will be defined for all users */}
      <DataTable<UserType>
        className=" border-none"
        items={fetchDataGenerator}
        columns={[
          { 
            value: data => (data.name || '(Name Unknown)'), 
            label: 'Name', 
            sortable: true 
          },
          { value: 'email' as const, label: 'Email', sortable: true },
          { value: data => titleCase(data.role as 'string'), label: 'Role' }
        ]}
        rowActions={[{
          label: 'Remove from Organization',
          onClick: (user: UserType) => { deleteOrganizationUser(user.id) }
        }, {
          label: 'Set Role to Admin',
          onClick: (user: UserType) => { updateUserRole(user.id, 'admin') }
        }, {
          label: 'Set Role to Editor',
          onClick: (user: UserType) => { updateUserRole(user.id, 'editor') }
        }, {
          label: 'Set Role to Viewer',
          onClick: (user: UserType) => { updateUserRole(user.id, 'viewer') }
        }]}
      />
    </div>
  )
}
