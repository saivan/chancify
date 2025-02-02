
import type { IconName } from "@repo/components"

type SidebarLinkDefinition = {
  name: string
  links: {
    label: string
    href: string
    icon: IconName
  }[]
}[]

export const coreRoutes: SidebarLinkDefinition = [{
  name: "Rewards",
  links: [{
    label: `Campaigns`,
    href: "/campaigns",
    icon: "megaphone",
  }, { 
    label: `Reward History`, 
    href: "/history", 
    icon: "gift" 
  }],
}, {
  name: "Organization",
  links: [{
    label: `Settings`, 
    href: "/settings", 
    icon: "cog",
  }, {
    label: `Users`, 
    href: "/users", 
    icon: "users" 
  }],
}]


export const helpRoutes: SidebarLinkDefinition = [{
  name: "Help",
  links: [
    { label: `Setup Guide`, href: "/guide", icon: "life-buoy" },
    {
      label: `Deployment Guide`,
      href: "/deployment",
      icon: "life-buoy",
    },
    {
      label: `Repository`,
      href: "https://github.com/saivan/chancify",
      icon: "github",
    },
  ],
}]
