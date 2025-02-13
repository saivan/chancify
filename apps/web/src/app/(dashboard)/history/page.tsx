
import { CenterBox } from "@/components/dashboard/CenterBox";
import { HistoryList } from "./HistoryList";
import { getOrganizationCampaigns } from "../serverActions";

export default async function () {
  const campaigns = await getOrganizationCampaigns()
  return (
    <div className="h-full grid grid-rows-[auto_1fr]">  
      <CenterBox
        title='History'
        caption='Here is a list of every spin your customers have had'
        className="pb-8"
      > <div></div> </CenterBox>
      <HistoryList campaigns={campaigns} />
    </div>
  )
}