import { CenterBox } from "@/components/dashboard/CenterBox"
import { Campaigns } from "./Campaigns"
import { getOrganizationCampaigns } from "../serverActions"


export default async function () {
  const campaigns = await getOrganizationCampaigns()
  return (
    <CenterBox
      title='Campaigns'
      caption='Define the actions you want customers to take'
    > 
      <Campaigns campaigns={campaigns} /> 
    </CenterBox>
  )
}
