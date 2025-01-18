
import { dynamodbConnection } from "@/config";
import { baseModel } from "@repo/models";
import { type PersonType } from "./Person";
import { type GroupType } from "./Group";
import { Group } from "./Group";
import { Person } from "./Person";
import { z } from "zod";


export const MembershipSchema = z.object({
  id: z.string(),
  club: z.string(),
  price: z.number(),
  personId: z.string(),
  groupId: z.string(),
  dateCreated: z.string(),
  dateUpdated: z.string(),
}).partial()
export type MembershipType = z.infer<typeof MembershipSchema>


export class Membership extends baseModel({
  name: 'Membership',
  schema: MembershipSchema,
  connection: dynamodbConnection,
  idGenerator: ({ personId, groupId }) => {
    const newId = `${personId}-${groupId}`;
    return newId;
  },
  indexes: [
    { partition: 'id' },
    { partition: ['club', 'personId'], sort: 'groupId' },
    { partition: ['club', 'groupId'], sort: 'personId' },
    { partition: 'club', sort: 'dateCreated' },
  ],
}) {

  async person() {
    if (this.data.personId == null) {
      throw new Error('Person ID is required');
    }
    const person = new Person(this.data.personId);
    await person.pull();
    return person;
  }

  async group() {
    if (this.data.groupId == null) {
      throw new Error('Group ID is required');
    }
    const group = new Group(this.data.groupId);
    await group.pull();
    return group;
  }

  static async create(
    person: PersonType | string,
    group: GroupType | string,
    club: string = 'default'
  ) {
    const personId = typeof person === 'string' ? person : person.id;
    const groupId = typeof group === 'string' ? group : group.id;
    const membership = new Membership({ personId, groupId, club });
    await membership.create();
    return membership;
  }
}
