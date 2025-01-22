
export interface Prize {
  name: string
  probability: number
}

export interface Theme {
  padding?: number
  frame?: Partial<{
    width: number
    inset: number
    outerStroke: string
    innerStroke: string
    outerFill: string
    innerFill: string
  }>
  pointer?: {
    width: number
  }
  lights?: Partial<{
    size: number
    count: number
    offColor: string
    onColor: string
    power: number
  }>
  wedges: Partial<{
    backgroundColor: string
    glowColor: string
    textColor: string
    radius: number
  }>[]
}

export interface WheelState {
  lights?: {
    animating: boolean
  }
}

export const frames = {
  gold: {
    width: 44,
    inset: 3,
    outerStroke: 'linear-gradient(140deg, #E19A19 13.29%, #FDF3D8 61.46%, #947424 65.36%, #EBC153 73.6%, #D59B04 86.83%) border-box',
    outerFill: 'linear-gradient(140deg, #D88D0E 6.59%, #F0CA5F 22.71%, #FDD37E 32.92%, #F4B043 42.31%, #9B5404 55.79%, #CC9F4A 74.99%, #F7BB45 93.72%) border-box',
    innerStroke: 'conic-gradient(from 140deg at 49.51% 50.7%, #F2EBBF 0deg, #D8B661 52.77752637863159deg, #FDD37E 108.80772471427917deg, #F4B043 147.59999871253967deg, #EDB55B 208.67242813110352deg, #825A16 269.60837602615356deg, #EAE4BA 360deg)',
    innerFill: `conic-gradient(from 140deg at 49.51% 50.7%, #D88D0E 0deg, #F0CA5F 66.60000085830688deg, #FDD37E 108.80772471427917deg, #F4B043 147.59999871253967deg, #9B5404 203.27728271484375deg, #CC9F4A 271.4095115661621deg, #D88D0E 360deg)`,
  },
}

export const themes: Record<string, Theme>= {
  red: {
    padding: 0.08,
    lights: {
      count: 22,
      size: 6,
    },
    pointer: {
      width: 0.30,
    },
    frame: {
      width: 40,
      inset: 3,
      outerStroke: 'linear-gradient(140deg, #E19A19 13.29%, #FDF3D8 61.46%, #947424 65.36%, #EBC153 73.6%, #D59B04 86.83%) border-box',
      outerFill: 'linear-gradient(140deg, #D88D0E 6.59%, #F0CA5F 22.71%, #FDD37E 32.92%, #F4B043 42.31%, #9B5404 55.79%, #CC9F4A 74.99%, #F7BB45 93.72%) border-box',
      innerStroke: 'conic-gradient(from 140deg at 49.51% 50.7%, #F2EBBF 0deg, #D8B661 52.77752637863159deg, #FDD37E 108.80772471427917deg, #F4B043 147.59999871253967deg, #EDB55B 208.67242813110352deg, #825A16 269.60837602615356deg, #EAE4BA 360deg)',
      innerFill: `conic-gradient(from 140deg at 49.51% 50.7%, #D88D0E 0deg, #F0CA5F 66.60000085830688deg, #FDD37E 108.80772471427917deg, #F4B043 147.59999871253967deg, #9B5404 203.27728271484375deg, #CC9F4A 271.4095115661621deg, #D88D0E 360deg)`,
    },
    wedges: [{
      // Amber
      backgroundColor: "#fffbeb",
      textColor: "#78350f",
      glowColor: "#d97706",
      radius: 25,
    }, {
      // Red
      backgroundColor: "#ef4444",
      textColor: "#7f1d1d",
      glowColor: '#450a0a',
      radius: 30,
    }]
  },
  candy: {
    padding: 0.08,
    lights: {
      count: 22,
      size: 5,
      onColor: "var(--color-yellow-200)",
      offColor: "var(--color-yellow-400)",
      power: 30,
    },
    pointer: {
      width: 0.30,
    },
    frame: frames['gold'],
    wedges: [{
      // Light red
      backgroundColor: "var(--color-pink-100)",
      textColor: "var(--color-pink-800)",
      glowColor: "var(--color-pink-600)",
      radius: 40,
    }, {
      // Pink
      backgroundColor: "var(--color-fuchsia-300)",
      textColor: "var(--color-fuchsia-800)",
      glowColor: 'var(--color-fuchsia-800)',
      radius: 30,
    }]
  },
}
