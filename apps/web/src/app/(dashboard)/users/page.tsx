import { CenterBox } from "@/components/dashboard/CenterBox";
import { UserList } from "./UserList";
import { NewUser } from "./NewUser";


export default function () {
  return (
    <div className="h-full grid grid-rows-[auto_1fr]">  
      <CenterBox
        title='Users'
        caption='Allow the right people to access your campaigns'
        className="pb-8"
      >
        <NewUser />
      </CenterBox>
      <UserList />
    </div>
  )
}






