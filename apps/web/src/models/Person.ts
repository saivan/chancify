
import { baseModel } from "@repo/models";
import { DEFAULT_GROUP } from "./Group";
import { z } from "zod";
import { dynamodbConnection } from '@/config'

export const PersonSchema = z.object({
  id: z.string(),
  club: z.string(),
  name: z.string(),
  age: z.string(),
  email: z.string(),
  notes: z.string(),
  dateCreated: z.string(),
  dateUpdated: z.string(),
}).partial()
export type PersonType = z.infer<typeof PersonSchema>


export class Person extends baseModel({
  name: 'Person',
  schema: PersonSchema,
  connection: dynamodbConnection,
  indexes: [
    { partition: 'id' },
    { partition: 'club', sort: 'dateCreated' },
  ],
}) {
  constructor(data: PersonType | string, club: string = DEFAULT_GROUP) {
    super(data);
    this.data.club = club;
  }
}
