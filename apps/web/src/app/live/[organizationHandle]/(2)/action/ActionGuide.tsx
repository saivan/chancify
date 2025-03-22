import { availableActionInstructions } from "@/models/Action";
import type { CampaignType } from "@/models/Campaign";
import type { OrganizationType } from "@/models/Organization";
import { Button, Icon, QRCode } from "@repo/components";
import Image from "next/image";
import { toast } from "sonner";




export function ActionGuide(props: {
  campaign: Partial<CampaignType>
  organization: Partial<OrganizationType>
  links: 'qr' | 'button'
}) {
  // Make sure the campaign has an action
  if (!props.campaign.action) {
    return <div> No action found </div>
  }

  // Check if the action can be completed with a url
  const actionId = props.campaign.action?.id
  const isUrlAction = [
    'instagram-follow',
    'google-review',
    'facebook-review',
    'facebook-follow',
    'tiktok-follow',
  ].includes(actionId)
  if (isUrlAction) {
    const url = generateUrl({
      organization: props.organization,
      campaign: props.campaign,
    })
    return (
      <UrlAction
        name={props.campaign.action?.name || ''}
        url={url}
        links={props.links}
        platform={props.campaign.action?.platform || ''}
        instruction={availableActionInstructions[props.campaign.action?.id]}
      />
    )
  }

  // Deal with tagging actions
  const isTagAction = [
    'instagram-tag',
    'tiktok-tag',
  ].includes(actionId)
  if (isTagAction) {
    return (
      <TagAction
        name={props.campaign.action?.name || ''}
        links={props.links}
        platform={props.campaign.action?.platform || ''}
        handle={
          actionId === 'instagram-tag'
            ? props.organization.instagramHandle as string
            : props.organization.tikTokHandle as string
        }
        instruction={availableActionInstructions[props.campaign.action?.id]}
      />
    )
  }


}

function UrlAction(props: {
  name: string
  url: string
  links: 'qr' | 'button'
  platform: string
  instruction: {
    qr: string
    button: string
  }
}) {
  return (
    <div className="flex flex-col gap-8">
      <Header
        name={props.name}
        instruction={props.instruction[props.links]}
      />
      {
        props.links === 'qr'
          ? <QRCodeAction url={props.url} />
          : <UrlActionButton
            url={props.url}
            label={props.name}
            platform={props.platform}
          />
      }
    </div>
  )
}

function TagAction(props: {
  name: string
  links: 'qr' | 'button'
  handle: string
  platform: string
  instruction: {
    qr: string
    button: string
  }
}) {
  async function handleCopyUrl() {
    try {
      await navigator.clipboard.writeText(props.handle)
      toast.success('Handle copied to clipboard')
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      toast.error('Failed to copy handle, please input it manually in the app')
    }
  }

  const url = props.platform === 'instagram' ? 'http://instagram.com'
    : props.platform === 'tiktok' ? 'http://tiktok.com'
      : props.platform === 'facebook' ? 'http://facebook.com'
        : ''

  return (
    <div className="flex flex-col gap-8">
      <Header
        name={props.name}
        instruction={props.instruction[props.links]}
      />
      <div className="flex flex-col gap-2">
        <div className="p-2 outline outline-border bg-white rounded-md flex justify-between items-center">
          @{props.handle}
          {
            props.links === 'button' &&
            <Button variant="default" onClick={handleCopyUrl} className="flex gap-2">
              <Icon icon="clipboard" />
              Copy Handle
            </Button>
          }
        </div>

        {
          props.links === 'qr'
            ? (
              <div className="flex flex-col gap-4 py-4">
                <p>Scan this QR code to open the app on your phone</p>
                <QRCodeAction url={url} />
              </div>
            ) : (
              <Button variant="outline" asChild
                className="flex justify-start gap-2 p-6">
                <a href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image height={24} width={24}
                    src={`/images/logos/${props.platform}.svg`}
                    alt={props.name}
                  />
                  {props.platform === 'instagram' ? 'Open Instagram' : 'Open TikTok'}
                </a>
              </Button>
            )
        }
      </div>
    </div>
  )
}


function Header(props: {
  name: string
  instruction: string
}) {
  return (
    <div>
      <h1 className='font-semibold text-2xl md:text-4xl tracking-tight text-slate-800 leading-tight'
      >{props.name}</h1>
      <p className='text-base md:text-lg text-slate-800 '>
        {props.instruction}
      </p>
    </div>
  )
}

function QRCodeAction(props: {
  url: string
}) {
  return (
    <div className="flex flex-col gap-4 border rounded-md border-border w-max max-w-full p-4">
      <QRCode url={props.url} />
    </div>
  )
}

function UrlActionButton(props: {
  url: string
  label: string
  platform: string
}) {
  return (
    <a
      target="_blank"
      href={props.url}
      className="flex items-center bg-white gap-2 p-4 border rounded-md border-border shadow-xs w-max max-w-full"
    >
      <Image width={32} height={32}
        src={`/images/logos/${props.platform}.svg`}
        alt={props.label}
      />
      <div>
        {props.label}
      </div>
    </a>
  )
}

function generateUrl({ organization, campaign }: {
  organization: Partial<OrganizationType>
  campaign: Partial<CampaignType>
}): string {
  if (campaign.action?.platform === 'google') {
    return organization.googleLink || ''
  }

  if (campaign.action?.platform === 'tiktok') {
    return `https://www.tiktok.com/@${organization.tikTokHandle}`
  }

  if (campaign.action?.platform === 'instagram') {
    return `https://www.instagram.com/${organization.instagramHandle}`
  }

  if (campaign.action?.platform === 'facebook') {
    return `https://fb.com/${organization.facebookUsername}`
  }

  return ''
}