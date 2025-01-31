
import { CenterBox } from "@/components/dashboard/CenterBox";
import { HistoryList } from "./HistoryList";

export default function () {
  return (
    <div className="h-full grid grid-rows-[auto_1fr]">  
      <CenterBox
        title='History'
        caption='Here is a list of every spin your customers have had'
        className="pb-8"
      > <div></div> </CenterBox>
      <HistoryList />
    </div>
  )
}