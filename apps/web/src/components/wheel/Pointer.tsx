'use client'

import type { Theme } from "@/models/Theme";
import { cn } from "@repo/utilities";
import {} from 'react'


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
        transform: `translate(42%) scale(${s}) translate(-25%, 0)`
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 222 138" fill="none">
        <g filter="url(#filter0_di_24_7)">
          <path d="M38.3814 71.9306C35.2371 71.242 35.2371 66.7581 38.3814 66.0695L178.699 35.3396C179.578 35.1473 180.458 35.6563 180.729 36.5135V36.5135C187.413 57.6553 187.413 80.3447 180.729 101.487V101.487C180.458 102.344 179.578 102.853 178.699 102.66L38.3814 71.9306Z" fill="url(#paint0_radial_24_7)" />
        </g>
        <defs>
          <filter id="filter0_di_24_7" x="0.723194" y="-0.000934601" width="220.319" height="138.002" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset />
            <feGaussianBlur stdDeviation="17.65" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
            <feBlend mode="darken" in2="BackgroundImageFix" result="effect1_dropShadow_24_7" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_24_7" result="shape" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset />
            <feGaussianBlur stdDeviation="16.25" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.0588235 0 0 0 0 0.0901961 0 0 0 0 0.164706 0 0 0 1 0" />
            <feBlend mode="normal" in2="shape" result="effect2_innerShadow_24_7" />
          </filter>
          <radialGradient id="paint0_radial_24_7" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-154.5 68.9695) scale(345.5 261.557)">
            <stop offset="0.617915" stopColor="#1E293B" />
            <stop offset="0.785026" stopColor="#1E293B" />
            <stop offset="0.915" stopColor="#475569" />
            <stop offset="1" stopColor="#1E293B" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}