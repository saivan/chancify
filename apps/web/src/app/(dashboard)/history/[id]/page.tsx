
import { CenterBox } from "@/components/dashboard/CenterBox"
import { CampaignType } from "@/models/Campaign"
import { HistoryType } from "@/models/History"
import { Badge, Button, Card, CardContent, CardHeader } from "@repo/components"
import { cn, titleCase } from "@repo/utilities"
import { getFullHistoryData } from "../../serverActions"
import VerifyButton, { ClaimButton } from "./ActionButtons"


export default async function (props: {
  params: { id: string }
}) {
  const { id } = await props.params
  const { history, campaign, organization } = await getFullHistoryData(id)

  return (
    <CenterBox
      back="/history"
      icon={campaign.action?.icon}
      title={history.prize?.name || '(No Prize)'}
      caption={campaign.action?.label || '(No Action)'}
      headerClassName="pb-2"
    >
      <div>
        <div className="flex w-full items-center justify-between pb-8">
          <div>
            <Badge variant={history.status === 'claimed' ? 'default' : 'outline'}>
              {titleCase(history.status || 'incomplete')}
            </Badge>
          </div>

          <div className="flex gap-4">
            <VerifyButton history={history} campaign={campaign} organization={organization} />
            <ClaimButton history={history} />
          </div>

        </div>
        <div className="flex flex-col gap-8">
          <StatusDisplay history={history} />
          <PrizeDetails campaign={campaign} history={history} />
          <CustomerDetails campaign={campaign} history={history} />
        </div>
      </div>
    </CenterBox>
  )
}


function StatusDisplay(props: {
  history: Partial<HistoryType>
}) {
  return (
    <Card>
      <CardHeader>
        <h2 className='font-semibold text-2xl md:text-xl tracking-tight text-slate-800 leading-tight'>
          Status
        </h2>
        <p className='text-sm md:text-base font-semibold italic text-slate-500 '>
          Keep track of whether the prize has been claimed
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-16">
          <div className="flex flex-col">
            <span className="text-sm text-slate-600">Status</span>
            <span className={cn(
              "font-semibold",
              props.history.status === 'claimed' ? 'text-green-600' : 'text-red-600',
            )}>{titleCase(props.history.status || 'incomplete')}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-slate-600" >Date</span>
            <span>{
              props.history.dateCreated &&
              new Date(props.history?.dateCreated).toLocaleDateString()
            }</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PrizeDetails(props: {
  campaign: Partial<CampaignType>
  history: Partial<HistoryType>
}) {
  return (
    <Card>
      <CardHeader>
        <h2 className='font-semibold text-2xl md:text-xl tracking-tight text-slate-800 leading-tight'>
          Prize Details
        </h2>
        <p className='text-sm md:text-base font-semibold italic text-slate-500 '>
          Information about the prize
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-16">
          <div className="flex flex-col">
            <span className="text-sm text-slate-600" >Prize</span>
            <span>{props.history.prize?.name || '(No Prize)'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-slate-600" >Campaign</span>
            <span>{props.campaign.action?.platform || '(No Platform)'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-slate-600" >Action</span>
            <span>{props.campaign.action?.label || '(No Action)'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


function CustomerDetails(props: {
  history: Partial<HistoryType>
  campaign: Partial<CampaignType>
}) {
  return (
    <Card>
      <CardHeader>
        <h2 className='font-semibold text-2xl md:text-xl tracking-tight text-slate-800 leading-tight'>
          Customer Details
        </h2>
        <p className='text-sm md:text-base font-semibold italic text-slate-500 '>
          Information about the customer
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {
            props.campaign.collectInformation?.name &&
            <div className="flex flex-col">
              <span className="text-sm text-slate-600" >Name</span>
              <span>{props.history.customer?.name || '(No Name Supplied)'}</span>
            </div>
          }
          {
            props.campaign.collectInformation?.email &&
            <div className="flex flex-col">
              <span className="text-sm text-slate-600" >Email</span>
              <span>{props.history.customer?.email || '(No Email Supplied)'}</span>
            </div>
          }
          {
            props.campaign.collectInformation?.phone &&
            <div className="flex flex-col">
              <span className="text-sm text-slate-600" >Phone</span>
              <span>{props.history.customer?.phone || '(No Phone Supplied)'}</span>
            </div>
          }
          {
            props.campaign.collectInformation?.postalAddress &&
            <div className="flex flex-col">
              <span className="text-sm text-slate-600" >Phone</span>
              <span>{props.history.customer?.postalAddress || '(No Address Supplied)'}</span>
            </div>
          }
        </div>
      </CardContent>
    </Card>
  )
}

