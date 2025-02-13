import { CenterBox } from "@/components/dashboard/CenterBox"
import { CampaignProvider } from "./provider"
import { getOrganizationCampaigns } from "../../serverActions"
import Image from "next/image"
import { EditCampaign } from "./EditCampaign"


export default async function Page({ params }: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const campaigns = await getOrganizationCampaigns()
  const campaign = campaigns.find(campaign => campaign.id === id)

  // If we don't have a campaign, return an error page
  if (!campaign) {
    return (
      <CenterBox
        back="/campaigns"
        title="Campaign not found"
        caption="The campaign you are looking for does not exist"
      >
        <Image height={36} width={36}
          src={`/images/logos/unknown.svg`}
          alt={'Campaign Missing Campaign'}
        />
      </CenterBox>
    )
  }

  // Render the campaign page
  return (
    <CampaignProvider initial={campaign}>
      <EditCampaign />
    </CampaignProvider>
  )
}
