"use client"

import { cn } from "@repo/utilities"
import type { CampaignType } from "@/models/Campaign"
import type { Theme, WheelState } from "@/models/Theme"
import dynamic from "next/dynamic"
import { Pointer } from "./Pointer"
import { Wedges } from "./Wedges"
import './wheelStyles.scss'


function Wheel(props: {
  className?: string
  prizes: CampaignType['prizes']
  state: WheelState
  theme: Theme
  onTransitionEnd?: () => void
  prizeIndex?: number
}) {
  // Calculate the angle of the wheel from the provided angle
  const minDegrees = 18

  // Create the wheel
  return (
    <div className={cn(
      'aspect-square block relative rounded-md', 
      props.className
    )}>
      <Wedges 
        theme={props.theme} 
        prizes={props.prizes} 
        minDegrees={minDegrees}
        prizeIndex={props.prizeIndex}
        onTransitionEnd={props.onTransitionEnd}
        className={cn(
          props.state.rotating && 'animate-spin-slow',
        )}
      />
      <LargeShadow theme={props.theme} />
      <InnerFrame theme={props.theme} />
      <OuterFrame theme={props.theme} />
      <Lights theme={props.theme} />
      <Pointer theme={props.theme} />
    </div>
  )
}

export const PrizeWheel = dynamic(
  async () => Wheel,
  {
    ssr: false,
    loading: () => (
      <div className="h-full aspect-square p-12">
        <div className="w-full h-full rounded-full bg-slate-300 animate-pulse"></div>
      </div>
    )
  }
)

function LargeShadow(props: {
  theme: Theme
}) {
  const p = props.theme.padding ?? 0
  return (
    <div
      className="absolute top-0 left-0 w-full h-full"
      style={{
        padding: `calc(${p * 100}%)`
      }}
    >
      <div
        className="relative rounded-full inset-0 top-0 left-0 w-full h-full"
        style={{
          mixBlendMode: 'multiply',
          boxShadow: `
            rgb(49, 42, 29, 0.4) 0px 0px 100px 100px inset, 
            rgb(49, 42, 29, 0.3) 20px 20px 180px 40px,
            rgb(49, 42, 29, 0.08) 10px 10px 20px 40px,
            rgb(49, 42, 29, 0.1) 20px 20px 20px 10px
          `,
        }}
      />
    </div>
  )
}

function InnerFrame(props: {
  theme: Theme
}) {
  const r = props.theme?.frame?.inset ?? 2
  return (<div className={cn(
    "absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2",
    "w-[10%] h-[10%] rounded-full",
  )}>
    {/* // Shadow */}
    <div className="w-full h-full rounded-full shadow-[10px_10px_60px] mix-blend-multiply" />
    {/* // Outer Ring */}
    <div className="w-full h-full rounded-full absolute top-0 left-0"
      style={{ background: props.theme?.frame?.innerStroke }}
    />
    {/* // Inner Ring */}
    <div className={`rounded-full absolute`}
      style={{
        width: `calc(100% - ${2 * r}%)`,
        height: `calc(100% - ${2 * r}%)`,
        left: `${r}%`,
        top: `${r}%`,
        background: props.theme?.frame?.innerFill,
      }}
    />
  </div>)
}

function OuterFrame(props: {
  theme: Theme
}) {
  const R = props.theme?.frame?.width ?? 10
  const r = props.theme?.frame?.inset ?? 1
  const p = props.theme.padding ?? 0

  return (
    <div>
      {/* Outer Highlight Ring */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{ padding: `calc(${p * 100}% - ${R / 2}px)` }}
      >
        <div
          className="relative top-0 rounded-full h-full inset-0 border-transparent"
          style={{
            borderWidth: (R) + 'px',
            background: props.theme?.frame?.outerStroke ?? '#1e293b',
            mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
          }}
        />
      </div>
      {/* Inner Ring */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{ padding: `calc(${p * 100}% - ${R / 2 - r}px)` }}
      >
        <div
          className="relative top-0 rounded-full h-full inset-0 border-transparent"
          style={{
            borderWidth: (R - 2 * r) + 'px',
            background: props.theme?.frame?.outerFill,
            mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
          }}
        />
      </div>
    </div>
  )
}

function Lights(props: {
  theme: Theme
}) {
  const n = props.theme?.lights?.count ?? 18
  const p = props.theme.padding ?? 0
  const s = props.theme?.lights?.size ?? 4
  const b = props.theme?.lights?.offColor ?? 'var(--color-yellow-400)'
  const c = props.theme?.lights?.onColor ?? 'var(--color-yellow-200)'
  const lights = Array.from({ length: n }, (_, i) => i)
  const power = props.theme?.lights?.power ?? 60
  const animationDuration = 1.6
  return (<div>
    {lights.map((_, i) => {
      return (
        <div
          key={i}
          className="absolute top-0 left-0 w-full h-full"
          style={{
            left: 0,
            padding: `calc(${p * 100}%)`,
            transform: `rotate(${i * 360 / n}deg)`,
          }}
        >
          <div className="absolute rounded-full w-full h-full left-[50%] animate-opacity"
            style={{
              background: c,
              width: `${s}%`,
              height: `${s}%`,
              mixBlendMode: 'screen',
              filter: 'blur(5px)',
              transform: 'translateX(-50%) translateY(-50%)',
              animationDuration: `${animationDuration}s`,
              animationDelay: `${i / n * animationDuration}s`,
            }}
          />
          <div className="absolute rounded-full w-full h-full left-[50%]"
            style={{
              background: b,
              width: `${s * 2 / 3}%`,
              height: `${s * 2 / 3}%`,
              transform: 'translateX(-50%) translateY(-50%)',
            }}
          />
          <div className="absolute rounded-full w-full h-full left-[50%] animate-opacity"
            style={{
              background: c,
              width: `${s * 2 / 3}%`,
              height: `${s * 2 / 3}%`,
              boxShadow: `0 0 40px ${power}px ${c}`,
              mixBlendMode: 'screen',
              transform: 'translateX(-50%) translateY(-50%)',
              animationDuration: `${animationDuration}s`,
              animationDelay: `${i / n * animationDuration}s`,
              '--base-opacity': 0.4,
              '--amplitude': 0.4,
            }}
          />
        </div>
      )
    })
    }
  </div>)
}

