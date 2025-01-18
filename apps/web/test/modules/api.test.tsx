

import { expect, describe, it } from 'vitest'
import { createCaller } from "@/trpc"


// @ts-ignore - We can create a caller with no arguments
const caller = createCaller()

describe("TRPC API", () => {
  it("should connect to the API", async () => {
    const res = await caller.test.greeting({ text: "world" })
    expect(res.greeting).toBe("Greetings world")
  })
})

