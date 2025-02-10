'use server'

import type { CampaignType } from "@/models/Campaign"


export async function selectRandomPrize(prizes: CampaignType['prizes']) {
  // Calculate total chance of all prizes
  if (prizes == null) throw new Error('Prizes are required')
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


export async function saveHistory(props: {
  prize: CampaignType['prizes'][0]
}) {
  // Save the prize to the history
  console.log(`saveHistory`, props.prize)
}
