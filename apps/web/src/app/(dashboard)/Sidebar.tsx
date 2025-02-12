"use client"

import * as auth from "@repo/authentication/client"
import { useLocalStorage, usePath } from "@repo/utilities/client"
import { 
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Icon, Button, 
  Separator, type IconName,
  cn,
} from "@repo/components";
import { UserButton } from "@repo/authentication/client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useContext, createContext } from "react";
import Image from "next/image";
import { useDashboard } from "./controller";

const titleStyle = " text-sm text-slate-500 font-semibold tracking-tight ";
const linkStyle = " text-slate-800 font-semibold ";
const padding = " p-4 ";

type SidebarLinkType = {
  icon: IconName
  href: string
  label: string
  isCompact?: boolean
}

type SidebarLinkGroup = {
  name: string
  links: SidebarLinkType[]
}

type SidebarContextType = {
  compacts: boolean
  isCompact: boolean
  setIsCompact: (value: boolean) => void
  toggleCompact: () => void
}

function Header() {
  const { isCompact, toggleCompact, compacts } = useContext(SidebarContext) 
  const compactClasses = isCompact ? " flex flex-col items-center gap-2 " : ""
  const iconName = isCompact ? "panel-left-open" : "panel-left-close"
  return (
    <div className={padding + compactClasses + "flex justify-between"}>
      <Link href="/" className="flex items-center">
        <div className="h-10 rounded-md">
          {
            isCompact
            ? <Image alt="Chancify Logo" src="/logo.svg" width={40} height={40} />
            : <Image alt="Chancify Logo" src="/logo-wide.svg" width={162} height={36} />
          }
        </div>
      </Link>
      {
        compacts &&
        <Button size="icon" variant="outline" onClick={toggleCompact} >
          <Icon icon={iconName} />
        </Button>
      }
    </div>
  );
}

function SidebarLink(props: SidebarLinkType) {
  // Determine whether we are compact
  const sidebarProps = useContext(SidebarContext)
  if (!sidebarProps) return null
  const { isCompact } = sidebarProps

  // Determine if this link is active
  const path = usePath()
  const active = path.startsWith(props.href)

  // Make the link chip
  const linkContent = (
    <Link
      href={props.href ? props.href : "/"}
      className={
        linkStyle +
        "flex w-full items-center gap-2 rounded-sm p-2 " +
        "hover:bg-slate-100 hover:text-slate-800 " +
        (active ? "bg-slate-50 outline outline-slate-300 " : "")
      }
    > <div>
        <Icon icon={props.icon} />
      </div>
      {!isCompact && <div> {props.label} </div>}
    </Link>
  )

  // Wrap the link in a tooltip if compact
  return (isCompact ?
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger className="block">{linkContent}</TooltipTrigger>
        <TooltipContent side="right" >{props.label} </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    : linkContent
  );
}

function SidebarLinks(props: {
  fill?: boolean
  className?: string
  groups: {
    name: string;
    links: SidebarLinkType[];
  }[]
}) {
  const { isCompact } = useContext(SidebarContext)
  const fillClasses = props.fill ? " flex-1 overflow-y-auto " : ''
  const compactClasses = isCompact ? ' flex flex-col items-center gap-2 ' : ''
  return (
    <div className={`${padding} ${props.className} ${fillClasses}`}>
      {[
        ...props.groups.map((group) => {
          return (
            <div key={group.name} className={compactClasses + " py-2"}>
              <div className={titleStyle}>{isCompact ? "" : group.name}</div>
              <div>
                {group.links.map((link) => {
                  return (
                    <SidebarLink key={link.href} isCompact={isCompact} {...link} />
                  )
                })}
              </div>
            </div>
          );
        }),
      ]}
    </div>
  );
}

function AuthChipLoader() {
  const { isCompact } = useContext(SidebarContext)
  const pulse = "bg-slate-400 rounded animate-pulse "
  return (
    <div className={padding + " flex items-center gap-2"}>
      <div className={pulse + "w-10 h-10"}></div>
      {!isCompact
        && <div className="flex flex-col gap-1">
          <p className={pulse + "h-4 w-32"}>.</p>
          <p className={pulse + "h-3 w-24"}>.</p>
        </div>
      }
    </div>
  )
}

function Authentication() {
  const { isCompact } = useContext(SidebarContext)
  const user = auth.authenticatedUser()
  const isLoaded = auth.isLoaded()
  const isSignedIn = auth.isSignedIn()
  const url = auth.profileImageUrl()
  if (!isLoaded || !isSignedIn) return <AuthChipLoader />

  if (isCompact) {
    return (
      <div className={padding}>
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "w-10 h-10 rounded-md",
            },
          }}
        />
      </div>
    )
  }

  return (
    <div className={padding}>
      <div className="relative flex items-center gap-3">
        {url && <img src={url} className="h-10 w-10 rounded-md fill object-cover " />}
        <div className="flex flex-col items-start">
          <p className="text-lg leading-5 font-medium text-slate-800"> {user?.username}</p>
          <p className="text-xs leading-4 text-slate-500">{user?.primaryEmailAddress?.emailAddress}</p>
        </div>
        <UserButton
          appearance={{
            elements: {
              rootBox: "absolute top-0 left-0 w-full h-full opacity-0",
              userButtonAvatarBox: "h-10 rounded-md",
              userButtonTrigger: "w-full h-full",
            },
          }}
        />
      </div>
    </div>
  )
}

const SidebarContext = createContext<SidebarContextType>({
  compacts: false,
  isCompact: false,
  setIsCompact: () => { },
  toggleCompact: () => { },
})

function LiveButton () {
  const { isCompact } = useContext(SidebarContext)
  const { state } = useDashboard()
  const handle = state.organizationHandle
  const linkContent = (
    <div className={padding}>
      <Link href={`/live/${handle}`}>
        <div
          className={cn(
            "bg-slate-800 text-white rounded-md py-2 flex items-center justify-center",
            "w-full gap-2",
            isCompact ? "px-2" : ""
          )}
        >
          <Icon icon="play" />{isCompact ? <></> : <span>Live</span> }
        </div>
      </Link>
    </div>
  )
  return isCompact ? (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger className="block">{linkContent}</TooltipTrigger>
        <TooltipContent side="right" >Live</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : linkContent
}

export function SidebarComponent(props: {
  links: SidebarLinkGroup[]
  help?: SidebarLinkGroup[]
  compacts?: boolean
  header?: boolean
  className?: string
}) {
  // Define the sidebar state
  const { compacts = false } = props
  const [storedCompact, setIsCompact] = useLocalStorage<boolean>('sidebar/isCompact', false)
  const isCompact = compacts && storedCompact
  const toggleCompact = () => setIsCompact(!isCompact)
  const sidebarClasses = "sticky top-0 flex h-[100vh] w-80 flex-col "
    + "border-r border-border "
    + (isCompact ? " w-auto " : "")
    + (props.className ? props.className : "")

  // Pass the context through to the children
  const state = { compacts, isCompact, setIsCompact, toggleCompact }
  return (
    <SidebarContext.Provider value={state} >
      <div className={sidebarClasses}>
        <Header />
        <Separator />
        <SidebarLinks fill groups={props.links} />
        {props.help && <>
          <Separator />
          <SidebarLinks groups={props.help} />
        </>}
        <Separator />
        <LiveButton />
        <Separator />
        <Authentication />
      </div>
    </SidebarContext.Provider>
  )
}

export const Sidebar = dynamic(() => Promise.resolve(SidebarComponent), { 
  loading: () => {
    return (
      <div className={cn(
        "w-80 h-full bg-slate-50 border-r border-border rounded animate-pulse" 
      )} />
    )
  },
  ssr: false, 
})
