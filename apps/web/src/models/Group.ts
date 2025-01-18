
import { dynamodbConnection } from "@/config";
import { baseModel } from "@repo/models";
import { z } from "zod";


export const GroupSchema = z.object({
  id: z.string(),
  club: z.string(),
  name: z.string(),
  weekday: z.string(),
  time: z.string(),
  dateCreated: z.string(),
  dateUpdated: z.string(),
}).partial()
export type GroupType = z.infer<typeof GroupSchema>

export const DEFAULT_GROUP = 'default';
export class Group extends baseModel({
  name: 'Group',
  schema: GroupSchema,
  connection: dynamodbConnection,
  indexes: [
    { partition: 'id' },
    { partition: 'club', sort: 'dateCreated' },
  ],
}) {
  constructor(data: GroupType | string, club: string = DEFAULT_GROUP) {
    super(data);
    this.data.club = club;
  }
}


