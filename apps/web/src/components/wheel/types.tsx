"use client"

export interface Prize {
  name: string
  probability: number
}

export interface Theme {
  padding?: number
  frame?: {
    width?: number
    inset?: number
    outerStroke?: string
    innerStroke?: string
    outerFill?: string
    innerFill?: string
  }
  pointer?: {
    width?: number
  }
  lights?: {
    size?: number
    count?: number
    offColor?: string
    onColor?: string
  }
  wedges: {
    backgroundColor: string
    glowColor: string
    textColor: string
    radius: number
  }[]
}

export interface WheelState {
  lights?: {
    brightness?: number[]
  }
}
