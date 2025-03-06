'use client'

import type { Theme } from "@/models/Theme";
import { cn } from "@repo/utilities";

export function Pointer(props: {
  className?: string
  theme: Theme
}) {
  const s = props.theme?.pointer?.width ?? 0.30
  return (
    <div
      className={cn(props.className,
        `absolute w-full h-full top-0`
      )}
      style={{
        transform: `translate(42%) scale(${s}, ${s/2}) translate(-25%, 0)`
      }}
    >
      {/* Define the SVG for clipping */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="0" 
        height="0" 
        style={{ position: 'absolute' }}
      >
        <defs>
          <clipPath id="pointerClipPath" clipPathUnits="objectBoundingBox">
            <path d="M0.173 0.521C0.159 0.516 0.159 0.484 0.173 0.479L0.805 0.256C0.809 0.255 0.813 0.258 0.814 0.264V0.264C0.844 0.418 0.844 0.582 0.814 0.735V0.735C0.813 0.742 0.809 0.745 0.805 0.744L0.173 0.521Z" />
          </clipPath>
        </defs>
      </svg>
      
      {/* The div that will be clipped */}
      <div 
        className="w-full h-full"
        style={{
          clipPath: "url(#pointerClipPath)",
          background: `radial-gradient(
            circle at 70% 50%, 
            #1E293B 61.79%, 
            #1E293B 78.50%, 
            #475569 91.50%, 
            #1E293B 100%
          )`,
          boxShadow: "0 0 35px rgba(0, 0, 0, 0.5) inset",
        }}
      />
    </div>
  )
}
