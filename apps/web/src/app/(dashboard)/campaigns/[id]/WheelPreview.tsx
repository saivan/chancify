'use client'

import { PrizeWheel } from "@/components/wheel"
import { type Theme, themes } from "@/models/Theme"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@repo/components"
import { cn, titleCase } from "@repo/utilities"
import { } from 'react'
import { useCampaign } from "./provider"


export function WheelPreview() {
  const [campaign] = useCampaign()
  const theme = themes[campaign.themeId || 'red']
  return (
    <div className="grid grid-cols-[20rem_auto] border border-border bg-slate-100 w-full h-192 overflow-clip rounded-lg">
      <div className="grid grid-rows-[auto_1fr] min-h-0 h-full border-r border-border bg-slate-100/60 z-10 backdrop-blur-md">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-xl">Wheel Theme</CardTitle>
          <CardDescription>
            Choose a theme for your wheel
          </CardDescription>
        </CardHeader>
        <div className="min-h-0 overflow-y-auto">
          <CardContent className="py-4">
            <ThemeSelector />
          </CardContent>
        </div>
      </div>
      <div className="relative">
        <PrizeWheel
          className="h-full absolute -right-16 overflow-hidden"
          state={{
            animating: false,
            prize: undefined,
            rotating: false,
          }}
          prizes={campaign.prizes ?? []}
          equallySized={campaign.equallySized}
          theme={theme} />
      </div>
    </div>
  )
}

function ThemeSelector() {
  const [campaign, setCampaign] = useCampaign()
  return (
    <div className="flex flex-col gap-4 h-full">
      {Object.entries(themes).map(([themeId, theme]) => (
        <ThemeButton
          key={theme.name}
          theme={theme}
          selected={themeId === campaign.themeId}
          onClick={() => setCampaign({ themeId })}
        />
      ))}
    </div>
  )
}


function ThemeButton(props: {
  theme: Theme
  selected?: boolean
  onClick?: () => void
}) {
  const frame = props.theme.frame
  const n = props.theme.wedges.length
  const primaryWedge = props.theme.wedges[0 % n]
  const secondaryWedge = props.theme.wedges[1 % n]
  const tertiaryWedge = props.theme.wedges[2 % n]
  const quaternaryWedge = props.theme.wedges[3 % n]
  return (
    <button className={cn(
      "flex p-1 gap-4 outline items-center w-full outline-slate-400 rounded-md",
      props.selected && "outline-2 outline-slate-900 font-semibold"
    )} onClick={props.onClick}>
      <div className="w-12 h-12 p-[0.05rem] rounded-lg" style={{
        background: frame?.outerStroke,
      }}>
        <div
          className="w-full h-full p-[0.2rem] grid grid-cols-2 grid-rows-2 rounded-lg"
          style={{
            background: frame?.innerStroke
          }} 
        >
          <div
            className="w-full h-full rounded-tl-md"
            style={{
              background: primaryWedge.backgroundColor,
              boxShadow: `0 0 8px ${primaryWedge.glowColor} inset`,
            }} />
          <div
            className="w-full h-full rounded-tr-md"
            style={{
              background: secondaryWedge.backgroundColor,
              boxShadow: `0 0 8px ${secondaryWedge.glowColor} inset`,
            }} />
          <div
            className="w-full h-full rounded-bl-md"
            style={{
              background: quaternaryWedge.backgroundColor,
              boxShadow: `0 0 8px ${quaternaryWedge.glowColor} inset`,
            }} />
          <div
            className="w-full h-full rounded-br-md"
            style={{
              background: tertiaryWedge.backgroundColor,
              boxShadow: `0 0 8px ${tertiaryWedge.glowColor} inset`,
            }} />
        </div>
      </div>
      <div
        className="text-lg"
      >{titleCase(props.theme.name)}</div>
    </button>
  )
}
