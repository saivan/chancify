import { Prize } from "./Campaign"
import { Customer } from "./Customer"


export type History = {
  id: string
  date: string
  status: 'claimed' | 'unclaimed'
  prize: Prize
  customer: Customer
  campaignId: string
}

