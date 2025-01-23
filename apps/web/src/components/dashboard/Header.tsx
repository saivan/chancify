"use client"

import { usePathComponents, kebabToTitleCase } from "@repo/utilities/client"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  SlideOver,
} from "@repo/components"
import dynamic from "next/dynamic"
import { Fragment, type ReactNode, Suspense } from "react"
import Link from "next/link"


export const Authentication = dynamic(
  () => import('./Authentication').then(mod => mod.Authentication), {
  loading: () => <div className="bg-slate-400 rounded animate-pulse w-10 h-10"></div>,
  ssr: false,
})


export function Header(props: {
  hasMenuButton?: boolean
  hasAuth?: boolean
  sidebar?: ReactNode
  sidebarButton?: ReactNode
}) {
  // Get the path for the breadcrumb
  const pathComponents = usePathComponents()
  const totalPath = ['', ...pathComponents]
  const BreadCrumbItems = totalPath.map((path, index) => {
    // Define the special cases
    const isFirst = index === 0
    const isLast = index === totalPath.length - 1

    // Get the link and label for the path
    const pathName = kebabToTitleCase(path)
    const link = isFirst
      ? '/'
      : `/${pathComponents.slice(0, index).join('/')}`
    const label = isFirst ? 'Home' : pathName

    // Create the component and return it
    return (
      <Fragment key={index}>
        <BreadcrumbItem>
          {
            isLast
              ? <BreadcrumbPage>{label}</BreadcrumbPage>
              : <BreadcrumbLink asChild>
                <Link href={link}>{label}</Link>
              </BreadcrumbLink>
          }
        </BreadcrumbItem>
        {!isLast && <BreadcrumbSeparator />}
      </ Fragment>)
  })

  // Create the header
  return (
    <div className="flex px-4 py-2 gap-4 items-center border-b border-border">
      <Suspense >
        <SlideOver
          button={props.sidebarButton}
          title="Application"
          description="A cool application"
          className={props.hasMenuButton ? "block md:hidden" : ""}
        > {props.sidebar} </SlideOver>
        <Breadcrumb className="flex-1">
          <BreadcrumbList>
            {BreadCrumbItems}
          </BreadcrumbList>
        </Breadcrumb>
        <Authentication />
      </Suspense>
    </div>
  )
}
