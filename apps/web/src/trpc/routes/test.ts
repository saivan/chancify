
import { z } from "zod"
import { 
  createTRPCRouter, publicProcedure, privateProcedure,
} from "@repo/api"
import { friendlyId } from '@repo/utilities'



export const testRouter = createTRPCRouter({
  greeting: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      return { greeting: `Greetings ${input.text}` }
    }),

  rockPaperScissors: publicProcedure
    .input(z.object({ choice: z.enum(['rock', 'paper', 'scissors']) }))
    .mutation(async ({ input }) => {
      const choices = ['rock', 'paper', 'scissors']
      await sleep(1000)
      const opponent = choices[Math.floor(Math.random() * choices.length)]
      if (input.choice === opponent) return { 
        result: 'tie', opponent,
      }
      if (
        (input.choice === 'rock' && opponent === 'scissors') ||
        (input.choice === 'scissors' && opponent === 'paper') ||
        (input.choice === 'paper' && opponent === 'rock')
      ) {
        return { result: 'win', opponent }
      }
      return { result: 'lose', opponent}
    }),

    colorSchemeGenerator: publicProcedure
      .input(z.object({ color: z.string().regex(/^#[0-9a-f]{6}$/i) }))
      .mutation(async ({ input }) => {
        // Convert hex to RGB
        const hexInput = input.color.replace('#', '')
        const r = parseInt(hexInput.substring(0, 2), 16) / 255
        const g = parseInt(hexInput.substring(2, 4), 16) / 255
        const b = parseInt(hexInput.substring(4, 6), 16) / 255
    
        // Convert RGB to HSL
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const l = (max + min) / 2
        const d = max - min
        const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
        
        // Make sure the hue is between 0 and 360
        let h = 0
        if (d !== 0) {
          if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60
          else if (max === g) h = ((b - r) / d + 2) * 60
          else if (max === b)  h = ((r - g) / d + 4) * 60
        }
    
        // Generate shades by varying lightness
        const shades = new Array(10).fill(0).map((_, i) => {
          const newL = 0.1 + (i * 0.8 / 9)  // Lightness from 10% to 90%
          return `hsl(${h}, ${s * 100}%, ${newL * 100}%)`
        })
    
        return { shades }
      }),

  friendlyId: publicProcedure
    .query(async () => {
      return { id: friendlyId() }
    }),

  authenticated: privateProcedure
    .input(z.object({ length: z.number() }))
    .query(async ({ input, ctx }) => {
      // Make sure we have the user id
      const userId = ctx.auth.userId
      if (userId === null) throw new Error('Failed to get user id')

      // Return a shorter version of the user id
      const shortId = userId.slice(0, input.length)
      return { text: `Your user id is ${shortId}` }
    }),
})


async function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
