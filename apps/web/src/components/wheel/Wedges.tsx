'use client'

import type { CampaignType } from '@/models/Campaign'
import type { Theme } from '@/models/Theme'
import { cn, cssToRGB } from '@repo/utilities/client'
import { useMemo } from 'react'


export function Wedges(props: {
  onTransitionEnd?: () => void
  style?: React.CSSProperties
  className?: string
  prizes: CampaignType['prizes']
  theme: Theme
  minDegrees: number
  prizeIndex?: number
}) {
  // Convert the prize chances to probabilities with a minimum threshold
  const { probabilities, cumulative } = useMemo(() => {
    const probabilities = toProbabilities(props.prizes, props.minDegrees/360)
    const cumulative = probabilities.map((_, index) => {
      return probabilities
        .slice(0, index)
        .reduce((sum, current) => sum + current, 0)
    })
    return { probabilities, cumulative }
  }, [props.prizes, props.minDegrees])

  // Calculate an angle 
  const angle = useMemo(() => {
    // Get the selected prize
    if (props.prizeIndex === undefined) return 0

    // Get within the range of the prize
    const minimumAngle = cumulative[props.prizeIndex] 
    const maximumAngle = minimumAngle + probabilities[props.prizeIndex]

    // Add a buffer
    const minBuffer = minimumAngle * 360 + props.minDegrees / 4
    const maxBuffer = maximumAngle * 360 - props.minDegrees / 4
    const randomAngle = Math.random() * (maxBuffer - minBuffer) + minBuffer
    return randomAngle + 360 * 5
  }, [props.prizeIndex])

  // Calculate a conical gradient to display all of the wedges
  const conicalGradient = useMemo(() => {
    let totalProbability = 0
    const stops = props.prizes.map((prize, index) => {
      const wedge = props.theme.wedges[index % props.theme.wedges.length]
      const color = cssToRGB(wedge.backgroundColor || '')
      const highlight = cssToRGB(wedge.glowColor || '')
      if (!color || !highlight) return ''

      const probability = probabilities[index]
      const startAngle = totalProbability * 360
      const endAngle = (totalProbability + probability) * 360
      const weights = [0.5, 0.7, 0.9, 1, 1, 0.9, 0.7, 0.5]
      const multipliedStops = weights.map((s, i) => {
        const t = i / (weights.length - 1)
        return {
          color: color.map((color, i) => s * color + (1 - s) * highlight[i]),
          angle: (startAngle + t * (endAngle - startAngle)),
        }
      })

      totalProbability += probability
      return multipliedStops.map(({ color, angle }) => {
        return `rgb(${color.join(',')}) ${angle}deg`
      })
    })
    return `conic-gradient(${stops.join(', ')})`
  }, [props.prizes, props.theme.wedges])

  // Place the text in the center of each wedge
  const textItems = useMemo(() => {
    let totalProbability = 0
    return props.prizes.map((prize, index) => {
      const probability = probabilities[index]
      const startAngle = totalProbability * 360
      const endAngle = (totalProbability + probability) * 360
      totalProbability += probability
      return {
        text: prize.name,
        color: props.theme.wedges[index % props.theme.wedges.length].textColor,
        angle: 90 - (startAngle + endAngle) / 2,
      }
    })
  }, [props.prizes, props.theme.wedges])

  // Create the wheel
  return (<div
    className={cn('w-full h-full transition-transform', props.className)}
    style={{ 
      padding: `${(props.theme.padding ?? 0) * 100}%`,
      transform: `rotate(${90-angle}deg)`,
      transition: 'transform 7s cubic-bezier(0.17, 0.84, 0.44, 1)',
      ...props.style,
    }}
    onTransitionEnd={(e) => {
      // Only trigger for transform transitions and when the event target is this element
      if (e.propertyName === 'transform' && e.target === e.currentTarget) {
        props.onTransitionEnd?.()
      }
    }}
  >
    <div className='w-full h-full rounded-full bg-red-300 relative'
      style={{ background: conicalGradient }}
    >
      {
        textItems.map((item, index) => {
          return <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center'
            key={index}
            style={{
              fontSize: 'clamp(1.8cqw, 18px, 10vh)',
              color: item.color,
              transform: `rotate(${-item.angle}deg) translateX(25%) `,
            }}> {item.text} </div>
        })
      }
    </div>
  </div>)
}


/**
 * Converts raw chances from prizes into probabilities with a minimum threshold
 * @param prizes Array of Prize objects containing chances to convert
 * @param minWidth Minimum probability threshold (default 5% or 0.05)
 * @returns Array of probabilities corresponding to input prizes
 */
export function toProbabilities(
  prizes: CampaignType['prizes'], 
  minWidth: number = 0.05
): number[] {
  // Convert to probabilities with minimum threshold
  if (prizes == null) throw new Error('Prizes are required')
  const chances = prizes.map(prize => prize.chance)
  const total = chances.reduce((sum, current) => sum + current, 0)
  const rawProbabilities = chances.map(chance => chance / total)
  
  // Find indices of probabilities below minimum threshold
  const belowMin = rawProbabilities
    .map((prob, index) => ({ prob, index }))
    .filter(item => item.prob < minWidth)
    .map(item => item.index)
  
  // Find indices of probabilities at or above minimum threshold  
  const aboveMin = rawProbabilities
    .map((prob, index) => ({ prob, index }))
    .filter(item => item.prob >= minWidth)
    .map(item => item.index)
  
  // If no probabilities are below minimum, return raw probabilities
  if (belowMin.length === 0) return rawProbabilities
  
  // Set minimum width for all below-threshold values, zero for others
  const result = rawProbabilities.map((prob, index) => 
    belowMin.includes(index) ? minWidth : 0
  )
  
  // Calculate how much probability remains after setting minimums
  const totalMinWidth = belowMin.length * minWidth
  const remaining = 1.0 - totalMinWidth
  
  // If we have values above minimum, redistribute remaining probability
  if (aboveMin.length > 0) {
    const aboveMinSum = aboveMin.reduce((sum, index) => sum + rawProbabilities[index], 0)
    return result.map((prob, index) => 
      aboveMin.includes(index) 
        ? (rawProbabilities[index] / aboveMinSum) * remaining 
        : prob
    )
  }
  return result
}

