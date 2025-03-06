
export interface Prize {
  name: string
  chance: number
}

export interface Theme {
  name: string
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
  animating: boolean
  rotating: boolean
  prize?: Prize
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

  silver: {
    width: 42,
    inset: 3,
    outerStroke: 'linear-gradient(140deg, #94A3B8 13.29%, #F1F5F9 61.46%, #64748B 65.36%, #E2E8F0 73.6%, #94A3B8 86.83%) border-box',
    outerFill: 'linear-gradient(140deg, #CBD5E1 6.59%, #E2E8F0 22.71%, #F8FAFC 32.92%, #94A3B8 42.31%, #475569 55.79%, #64748B 74.99%, #CBD5E1 93.72%) border-box',
    innerStroke: 'conic-gradient(from 140deg at 49.51% 50.7%, #F1F5F9 0deg, #E2E8F0 52.77deg, #CBD5E1 108.80deg, #94A3B8 147.59deg, #64748B 208.67deg, #475569 269.60deg, #F1F5F9 360deg)',
    innerFill: 'conic-gradient(from 140deg at 49.51% 50.7%, #94A3B8 0deg, #CBD5E1 66.60deg, #E2E8F0 108.80deg, #94A3B8 147.59deg, #64748B 203.27deg, #475569 271.40deg, #94A3B8 360deg)',
  },

  roseGold: {
    width: 42,
    inset: 3,
    outerStroke: 'linear-gradient(140deg, #B76E79 13.29%, #FDD5DC 61.46%, #E6A5AF 65.36%, #F7C7CE 73.6%, #D49098 86.83%) border-box',
    outerFill: 'linear-gradient(140deg, #E6A5AF 6.59%, #F7C7CE 22.71%, #FDD5DC 32.92%, #D49098 42.31%, #B76E79 55.79%, #C37F89 74.99%, #E6A5AF 93.72%) border-box',
    innerStroke: 'conic-gradient(from 140deg at 49.51% 50.7%, #FDD5DC 0deg, #F7C7CE 52.77deg, #E6A5AF 108.80deg, #D49098 147.59deg, #C37F89 208.67deg, #B76E79 269.60deg, #FDD5DC 360deg)',
    innerFill: 'conic-gradient(from 140deg at 49.51% 50.7%, #E6A5AF 0deg, #F7C7CE 66.60deg, #FDD5DC 108.80deg, #D49098 147.59deg, #C37F89 203.27deg, #B76E79 271.40deg, #E6A5AF 360deg)',
  },

  white: {
    width: 40,
    inset: 3,
    outerStroke: 'linear-gradient(140deg, #F8FAFC 13.29%, #FFFFFF 61.46%, #F1F5F9 65.36%, #FFFFFF 73.6%, #F8FAFC 86.83%) border-box',
    outerFill: 'linear-gradient(140deg, #F1F5F9 6.59%, #F8FAFC 22.71%, #FFFFFF 32.92%, #F1F5F9 42.31%, #E2E8F0 55.79%, #F1F5F9 74.99%, #F8FAFC 93.72%) border-box',
    innerStroke: 'conic-gradient(from 140deg at 49.51% 50.7%, #FFFFFF 0deg, #F8FAFC 52.77deg, #F1F5F9 108.80deg, #E2E8F0 147.59deg, #F1F5F9 208.67deg, #F8FAFC 269.60deg, #FFFFFF 360deg)',
    innerFill: 'conic-gradient(from 140deg at 49.51% 50.7%, #F8FAFC 0deg, #FFFFFF 66.60deg, #F8FAFC 108.80deg, #F1F5F9 147.59deg, #E2E8F0 203.27deg, #F1F5F9 271.40deg, #F8FAFC 360deg)',
  }, 

  ivory: {
    width: 42,
    inset: 3,
    outerStroke: 'linear-gradient(140deg, #fef3c7 13.29%, #fffbeb 61.46%, #fde68a 65.36%, #fef3c7 73.6%, #f59e0b 86.83%) border-box',
    outerFill: 'linear-gradient(140deg, #fef3c7 6.59%, #fffbeb 22.71%, #fffbeb 32.92%, #fef3c7 42.31%, #fbbf24 55.79%, #f59e0b 74.99%, #fef3c7 93.72%) border-box',
    innerStroke: 'conic-gradient(from 140deg at 49.51% 50.7%, #fffbeb 0deg, #fef3c7 52.77deg, #fef3c7 108.80deg, #fde68a 147.59deg, #fbbf24 208.67deg, #f59e0b 269.60deg, #fffbeb 360deg)',
    innerFill: 'conic-gradient(from 140deg at 49.51% 50.7%, #fef3c7 0deg, #fffbeb 66.60deg, #fef3c7 108.80deg, #fde68a 147.59deg, #fbbf24 203.27deg, #f59e0b 271.40deg, #fef3c7 360deg)',
  },

  ocean: {
    width: 42,
    inset: 3,
    outerStroke: 'linear-gradient(140deg, #0c4a6e 13.29%, #bae6fd 61.46%, #0369a1 65.36%, #7dd3fc 73.6%, #0284c7 86.83%) border-box',
    outerFill: 'linear-gradient(140deg, #0ea5e9 6.59%, #38bdf8 22.71%, #7dd3fc 32.92%, #0284c7 42.31%, #075985 55.79%, #0369a1 74.99%, #0ea5e9 93.72%) border-box',
    innerStroke: 'conic-gradient(from 140deg at 49.51% 50.7%, #bae6fd 0deg, #7dd3fc 52.77deg, #38bdf8 108.80deg, #0ea5e9 147.59deg, #0284c7 208.67deg, #075985 269.60deg, #bae6fd 360deg)',
    innerFill: 'conic-gradient(from 140deg at 49.51% 50.7%, #0ea5e9 0deg, #38bdf8 66.60deg, #7dd3fc 108.80deg, #0284c7 147.59deg, #075985 203.27deg, #0369a1 271.40deg, #0ea5e9 360deg)',
  },

  emerald: {
    width: 40,
    inset: 3,
    outerStroke: 'linear-gradient(140deg, #064e3b 13.29%, #a7f3d0 61.46%, #047857 65.36%, #34d399 73.6%, #059669 86.83%) border-box',
    outerFill: 'linear-gradient(140deg, #10b981 6.59%, #34d399 22.71%, #6ee7b7 32.92%, #059669 42.31%, #065f46 55.79%, #047857 74.99%, #10b981 93.72%) border-box',
    innerStroke: 'conic-gradient(from 140deg at 49.51% 50.7%, #a7f3d0 0deg, #6ee7b7 52.77deg, #34d399 108.80deg, #10b981 147.59deg, #059669 208.67deg, #065f46 269.60deg, #a7f3d0 360deg)',
    innerFill: 'conic-gradient(from 140deg at 49.51% 50.7%, #10b981 0deg, #34d399 66.60deg, #6ee7b7 108.80deg, #059669 147.59deg, #065f46 203.27deg, #047857 271.40deg, #10b981 360deg)',
  },

  orange: {
    width: 41,
    inset: 3,
    outerStroke: 'linear-gradient(140deg, #9a3412 13.29%, #fed7aa 61.46%, #c2410c 65.36%, #fb923c 73.6%, #ea580c 86.83%) border-box',
    outerFill: 'linear-gradient(140deg, #f97316 6.59%, #fb923c 22.71%, #fdba74 32.92%, #ea580c 42.31%, #9a3412 55.79%, #c2410c 74.99%, #f97316 93.72%) border-box',
    innerStroke: 'conic-gradient(from 140deg at 49.51% 50.7%, #fed7aa 0deg, #fdba74 52.77deg, #fb923c 108.80deg, #f97316 147.59deg, #ea580c 208.67deg, #9a3412 269.60deg, #fed7aa 360deg)',
    innerFill: 'conic-gradient(from 140deg at 49.51% 50.7%, #f97316 0deg, #fb923c 66.60deg, #fdba74 108.80deg, #ea580c 147.59deg, #9a3412 203.27deg, #c2410c 271.40deg, #f97316 360deg)',
  },

  purple: {
    width: 40,
    inset: 3,
    outerStroke: 'linear-gradient(140deg, var(--color-purple-900) 13.29%, var(--color-purple-100) 61.46%, var(--color-purple-700) 65.36%, var(--color-purple-300) 73.6%, var(--color-purple-600) 86.83%) border-box',
    outerFill: 'linear-gradient(140deg, var(--color-purple-500) 6.59%, var(--color-purple-300) 22.71%, var(--color-purple-200) 32.92%, var(--color-purple-600) 42.31%, var(--color-purple-800) 55.79%, var(--color-purple-700) 74.99%, var(--color-purple-500) 93.72%) border-box',
    innerStroke: 'conic-gradient(from 140deg at 49.51% 50.7%, var(--color-purple-100) 0deg, var(--color-purple-200) 52.77deg, var(--color-purple-300) 108.80deg, var(--color-purple-500) 147.59deg, var(--color-purple-600) 208.67deg, var(--color-purple-800) 269.60deg, var(--color-purple-100) 360deg)',
    innerFill: 'conic-gradient(from 140deg at 49.51% 50.7%, var(--color-purple-500) 0deg, var(--color-purple-300) 66.60deg, var(--color-purple-200) 108.80deg, var(--color-purple-600) 147.59deg, var(--color-purple-800) 203.27deg, var(--color-purple-700) 271.40deg, var(--color-purple-500) 360deg)',
  },

  pink: {
    width: 43,
    inset: 3,
    outerStroke: 'linear-gradient(140deg, var(--color-rose-900) 13.29%, var(--color-rose-100) 61.46%, var(--color-rose-700) 65.36%, var(--color-rose-300) 73.6%, var(--color-rose-600) 86.83%) border-box',
    outerFill: 'linear-gradient(140deg, var(--color-rose-500) 6.59%, var(--color-rose-300) 22.71%, var(--color-rose-200) 32.92%, var(--color-rose-600) 42.31%, var(--color-rose-800) 55.79%, var(--color-rose-700) 74.99%, var(--color-rose-500) 93.72%) border-box',
    innerStroke: 'conic-gradient(from 140deg at 49.51% 50.7%, var(--color-rose-100) 0deg, var(--color-rose-200) 52.77deg, var(--color-rose-300) 108.80deg, var(--color-rose-500) 147.59deg, var(--color-rose-600) 208.67deg, var(--color-rose-800) 269.60deg, var(--color-rose-100) 360deg)',
    innerFill: 'conic-gradient(from 140deg at 49.51% 50.7%, var(--color-rose-500) 0deg, var(--color-rose-300) 66.60deg, var(--color-rose-200) 108.80deg, var(--color-rose-600) 147.59deg, var(--color-rose-800) 203.27deg, var(--color-rose-700) 271.40deg, var(--color-rose-500) 360deg)',
  },

  obsidian: {
    width: 42,
    inset: 3,
    outerStroke: 'linear-gradient(140deg, #18181b 13.29%, #3f3f46 61.46%, #09090b 65.36%, #27272a 73.6%, #18181b 86.83%) border-box',
    outerFill: 'linear-gradient(140deg, #27272a 6.59%, #3f3f46 22.71%, #52525b 32.92%, #18181b 42.31%, #09090b 55.79%, #18181b 74.99%, #27272a 93.72%) border-box',
    innerStroke: 'conic-gradient(from 140deg at 49.51% 50.7%, #3f3f46 0deg, #27272a 52.77deg, #27272a 108.80deg, #18181b 147.59deg, #09090b 208.67deg, #18181b 269.60deg, #3f3f46 360deg)',
    innerFill: 'conic-gradient(from 140deg at 49.51% 50.7%, #27272a 0deg, #3f3f46 66.60deg, #52525b 108.80deg, #18181b 147.59deg, #09090b 203.27deg, #18181b 271.40deg, #27272a 360deg)',
  },

  blueObsidian: {
    width: 42,
    inset: 3,
    outerStroke: 'linear-gradient(140deg, #020617 13.29%, #334155 61.46%, #020617 65.36%, #1e293b 73.6%, #0f172a 86.83%) border-box',
    outerFill: 'linear-gradient(140deg, #1e293b 6.59%, #334155 22.71%, #475569 32.92%, #0f172a 42.31%, #020617 55.79%, #0f172a 74.99%, #1e293b 93.72%) border-box',
    innerStroke: 'conic-gradient(from 140deg at 49.51% 50.7%, #334155 0deg, #1e293b 52.77deg, #1e293b 108.80deg, #0f172a 147.59deg, #020617 208.67deg, #0f172a 269.60deg, #334155 360deg)',
    innerFill: 'conic-gradient(from 140deg at 49.51% 50.7%, #1e293b 0deg, #334155 66.60deg, #475569 108.80deg, #0f172a 147.59deg, #020617 203.27deg, #0f172a 271.40deg, #1e293b 360deg)',
  }

}

export const themes: Record<string, Theme> = {
  red: {
    name: 'Red',
    padding: 0.08,
    lights: {
      offColor: "var(--color-yellow-400)",
      onColor: "var(--color-yellow-200)",
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

  rose: {
    name: 'Rose',
    padding: 0.08,
    lights: {
      onColor: "var(--color-rose-200)",
      offColor: "var(--color-rose-600)",
    },
    pointer: {
      width: 0.31,
    },
    frame: frames.pink,
    wedges: [{
      backgroundColor: "var(--color-rose-50)",
      textColor: "var(--color-rose-900)",
      glowColor: "var(--color-rose-600)",
      radius: 34,
    }, {
      backgroundColor: "var(--color-rose-500)",
      textColor: "var(--color-rose-50)",
      glowColor: "var(--color-rose-950)",
      radius: 29,
    }]
  },

  sunset: {
    name: 'Sunset',
    padding: 0.08,
    lights: {
      onColor:  "var(--color-orange-200)",
      offColor: "var(--color-orange-700)",
    },
    pointer: {
      width: 0.30,
    },
    frame: frames.orange,
    wedges: [{
      backgroundColor: "#fff7ed", // orange-50
      textColor: "#9a3412", // orange-900
      glowColor: "#ea580c", // orange-600
      radius: 38,
    }, {
      backgroundColor: "#f97316", // orange-500
      textColor: "#fff7ed", // orange-50
      glowColor: "#7c2d12", // orange-950
      radius: 33,
    }]
  }, 

  emerald: {
    name: 'Emerald',
    padding: 0.08,
    lights: {
      onColor: "#6ee7b7", // emerald-300
      offColor: "#047857", // emerald-700
    },
    pointer: {
      width: 0.32,
    },
    frame: frames.emerald,
    wedges: [{
      backgroundColor: "var(--color-emerald-500)",
      textColor: "var(--color-emerald-900)",
      glowColor: "var(--color-emerald-600)",
      radius: 32,
    }, {
      backgroundColor: "var(--color-lime-200)",
      textColor: "var(--color-lime-950)",
      glowColor: "var(--color-lime-500)",
      radius: 28,
    }]
  },

  ocean: {
    name: 'Ocean',
    padding: 0.08,
    lights: {
      onColor: "var(--color-sky-300)",
      offColor: "var(--color-sky-700)",
    },
    pointer: {
      width: 0.30,
    },
    frame: frames.ocean,
    wedges: [{
      backgroundColor: "var(--color-sky-300)",
      textColor: "var(--color-sky-900)",
      glowColor: "var(--color-sky-600)",
      radius: 35,
    }, {
      backgroundColor: "var(--color-cyan-500)",
      textColor: "var(--color-cyan-50)",
      glowColor: "var(--color-cyan-900)",
      radius: 30,
    }]
  },

  purple: {
    name: 'Purple',
    padding: 0.08,
    lights: {
      onColor: "var(--color-purple-200)",
      offColor: "var(--color-purple-600)",
    },
    pointer: {
      width: 0.32,
    },
    frame: frames.purple,
    wedges: [{
      backgroundColor: "var(--color-purple-50)",
      textColor: "var(--color-purple-900)",
      glowColor: "var(--color-purple-600)",
      radius: 32,
    }, {
      backgroundColor: "var(--color-purple-500)",
      textColor: "var(--color-purple-50)",
      glowColor: "var(--color-purple-950)",
      radius: 28,
    }]
  },

  roseGold: {
    name: 'Rose Gold',
    padding: 0.08,
    lights: {
      onColor: "var(--color-rose-200)",
      offColor: "var(--color-rose-400)",
    },
    pointer: {
      width: 0.32,
    },
    frame: frames.roseGold,
    wedges: [{
      backgroundColor: "var(--color-rose-50)",
      textColor: "var(--color-rose-900)",
      glowColor: "var(--color-rose-300)",
      radius: 32,
    }, {
      backgroundColor: "var(--color-rose-200)",
      textColor: "var(--color-rose-900)",
      glowColor: "var(--color-rose-300)",
      radius: 28,
    }]
  },

  candy: {
    name: 'Candy',
    padding: 0.08,
    lights: {
      onColor: "var(--color-pink-200)",
      offColor: "var(--color-pink-400)",
    },
    pointer: {
      width: 0.30,
    },
    frame: frames.roseGold,
    wedges: [{
      // Candy stripe pink
      backgroundColor: "var(--color-pink-100)",
      textColor: "var(--color-pink-800)",
      glowColor: "var(--color-pink-400)",
      radius: 35,
    }, {
      // Mint stripe
      backgroundColor: "var(--color-emerald-100)",
      textColor: "var(--color-emerald-800)",
      glowColor: "var(--color-emerald-400)",
      radius: 32,
    }, {
      // Candy stripe red
      backgroundColor: "var(--color-rose-200)",
      textColor: "var(--color-rose-50)",
      glowColor: "var(--color-rose-300)",
      radius: 30,
    }, {
      // Cotton candy blue
      backgroundColor: "var(--color-sky-200)",
      textColor: "var(--color-sky-800)",
      glowColor: "var(--color-sky-400)",
      radius: 33,
    }, {
      // Lemon drop
      backgroundColor: "var(--color-yellow-200)",
      textColor: "var(--color-yellow-800)",
      glowColor: "var(--color-yellow-400)",
      radius: 31,
    }, {
      // Grape
      backgroundColor: "var(--color-purple-300)",
      textColor: "var(--color-purple-50)",
      glowColor: "var(--color-purple-400)",
      radius: 34,
    }]
  },

  silverFrost: {
    name: 'Silver Frost',
    padding: 0.08,
    lights: {
      onColor: "var(--color-slate-200)",
      offColor: "var(--color-slate-400)",
    },
    pointer: {
      width: 0.30,
    },
    frame: frames.silver,
    wedges: [{
      backgroundColor: "var(--color-slate-50)",
      textColor: "var(--color-slate-900)",
      glowColor: "var(--color-slate-400)",
      radius: 35,
    }, {
      backgroundColor: "var(--color-slate-200)",
      textColor: "var(--color-slate-900)",
      glowColor: "var(--color-slate-500)",
      radius: 30,
    }]
  },

  obsidianShimmer: {
    name: 'Obsidian Shimmer',
    padding: 0.08,
    lights: {
      onColor: "var(--color-slate-400)",
      offColor: "var(--color-slate-800)",
    },
    pointer: {
      width: 0.32,
    },
    frame: frames.blueObsidian,
    wedges: [{
      backgroundColor: "var(--color-slate-400)",
      textColor: "var(--color-slate-50)",
      glowColor: "var(--color-slate-800)",
      radius: 34,
    }, {
      backgroundColor: "var(--color-slate-600)",
      textColor: "var(--color-slate-100)",
      glowColor: "var(--color-slate-400)",
      radius: 30,
    }]
  },
}
