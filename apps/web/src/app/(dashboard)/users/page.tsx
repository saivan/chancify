import { CenterBox } from "@/components/dashboard/CenterBox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@repo/components";
import { UserList } from "./UserList";

export default function () {
  return (
    <div className="h-full grid grid-rows-[auto_1fr]">  
      <CenterBox
        title='Users'
        caption='Allow the right people to access your campaigns'
      >
        <NewUser />
        </CenterBox>
      <UserList />
    </div>
  )
}


function NewUser () {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Add User</CardTitle>
        <CardDescription>
          Add a new user to your organization
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Label htmlFor="new-user-name">Name</Label>
        <Input id="new-user-name" placeholder="John Smith" />
        <Label htmlFor="new-user-email">Email</Label>
        <Input id="new-user-email" placeholder="john@email.com" />
      </CardContent>
    </Card>
  )
}





