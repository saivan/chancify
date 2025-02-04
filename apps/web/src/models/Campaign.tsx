import { createObjectContext } from "@repo/utilities/client"
import type { Action } from './Action'
import type { Theme } from './Theme'
import {} from 'react'

export type Brand = 'google' | 'instagram' | 'tiktok' | 'facebook' | 'personal'

export type Prize = {
  id: string
  name: string
  chance: number
}

export type CollectInformation = {
  name: boolean
  phone: boolean
  email: boolean
  postalAddress: boolean
}

export type Campaign = {
  id: string
  status: string
  action: Action
  platform: string
  prizes: Prize[]
  theme: Theme
  collectInformation: CollectInformation
}

export const [useCampaign, CampaignProvider] = createObjectContext<Campaign>()


/**
 * Converts raw chances from prizes into probabilities with a minimum threshold
 * @param prizes Array of Prize objects containing chances to convert
 * @param minWidth Minimum probability threshold (default 5% or 0.05)
 * @returns Array of probabilities corresponding to input prizes
 */
export function toProbabilities(prizes: Prize[], minWidth: number = 0.05): number[] {
  // Convert to probabilities with minimum threshold
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


export function selectRandomPrize(prizes: Prize[]) {
  // Calculate total chance of all prizes
  const totalChance = prizes.reduce((sum, prize) => sum + prize.chance, 0)
  
  // Find first prize where the cumulative chance is greater than a random number
  const random = Math.random() * totalChance
  let cumulativeChance = 0
  for (let i = 0; i < prizes.length; i++) {
    cumulativeChance += prizes[i].chance
    if (random < cumulativeChance) {
      return { 
        index: i, 
        prize: prizes[i] 
      }
    }
  }
  
  // Edge case: shouldn't happen except for floating point rounding
  return { 
    index: prizes.length - 1, 
    prize: prizes[prizes.length - 1] 
  }
}
