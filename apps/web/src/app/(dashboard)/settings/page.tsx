'use client'

import { CenterBox } from "@/components/dashboard/CenterBox";
import { Button, cn, Icon, Input, Label, LabelledInput, LoadingButton, QRCode, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/components";
import Image from "next/image";
import { useRef, useState } from 'react';
import { useDashboard } from "../controller";
import { copyToClipboard, downloadSvg } from "@repo/utilities/client";
import { toast } from "sonner";


export default function () {
  return (
    <div>
      <CenterBox
        title='Organization Settings'
        caption='Change settings to administrate your organization'
      >
        <div className="flex flex-col gap-8 py-8" >
          <SocialAccounts />
          <LivePage />
          <QRCodeArea />
        </div>
      </CenterBox>
    </div>
  )
}

function FormArea(props: {
  title: string
  caption: string
  children: React.ReactNode
}) {
  return (
    <div className={cn(
      "flex flex-col md:flex-row border-t border-slate-300 py-8 gap-8",
    )}>
      <div className="w-72">
        <h2 className="text-xl font-semibold">{props.title}</h2>
        <p className="text-sm text-slate-600">{props.caption}</p>
      </div>
      <div>
        {props.children}
      </div>
    </div>
  )

}

function SocialAccounts() {
  return (
    <FormArea
      title="Social Accounts"
      caption="Connect your social accounts to share your campaigns"
    >
      <div className="flex flex-col gap-8">
        <GoogleMyBusinessAccount />
        <InstagramAccount />
        <TikTokAccount />
        <FacebookAccount />
      </div>
    </FormArea>
  )
}

function LivePage() {
  const { state } = useDashboard()
  const { updateOrganizationHandle } = useDashboard()
  const [handle, setHandle] = useState(state.organizationHandle)
  const [loading, setLoading] = useState(false)
  return (
    <FormArea
      title="Live Url"
      caption="Customers will access your campaigns at chancify.org"
    >
      <Label htmlFor="url-input">Handle</Label>
      <div className="flex gap-2 flex-wrap">
        <LabelledInput
          id="url-input"
          placeholder="handle"
          label="app.chancify.org/live/"
          className="w-96 max-w-full"
          onChange={e => setHandle(e.target.value)}
          value={handle}
        />
        <LoadingButton variant="destructive" loading={loading} size='sm'
          className="min-w-max"
          onClick={async () => {
            setLoading(true)
            if (handle == null) throw new Error('Handle is required')
            await updateOrganizationHandle(handle)
            setLoading(false)
          }}
        >Change Handle</LoadingButton>
      </div>
      <span className="text-xs text-slate-500">Changing this breaks existing links and QR codes</span>
    </FormArea>
  )
}

function QRCodeArea() {
  const { state } = useDashboard()
  const qrContainerRef = useRef<HTMLDivElement>(null)
  
  // FIX: Make this work on the server
  const qrCodeUrl = `${window.origin}/live/${state.organizationHandle}/campaigns?links=button`
  
  async function handleDownloadQRCode() {
    if (!qrContainerRef.current) return
    const svg = qrContainerRef.current.querySelector('svg')
    if (!svg || !(svg instanceof SVGElement)) return
    try {
      await downloadSvg(svg, {
        fileName: `${state.organizationHandle}-qrcode`,
        format: 'png',
        width: 2000,
        height: 2000,
      })
      
      toast.success('QR code downloaded')
    } catch (error) {
      console.error('Failed to download QR code:', error)
      toast.error('Failed to download QR code')
    }
  }
  
  async function handleCopyUrl() {
    try {
      await copyToClipboard(qrCodeUrl)
      toast.success('URL copied to clipboard')
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      toast.error('Failed to copy URL')
    }
  }
  
  return (
    <FormArea
      title="Customer QR Code"
      caption="Provide customers with this QR code to allow them to access this campaign on their mobiles"
    >
      <div className="flex flex-col gap-2 p-4 border rounded-md border-slate-300">
        <div 
          className="border rounded-md border-slate-700 p-2"
          ref={qrContainerRef}
        >
          <QRCode url={qrCodeUrl} />
        </div>

        <div className="flex gap-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" asChild>
                <a 
                  href={qrCodeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Icon icon="external-link" />
                </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Open in New Tab
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='outline' size="icon" onClick={handleDownloadQRCode}>
                  <Icon icon="download" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Download QR Code as PNG
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleCopyUrl}>
                  <Icon icon="clipboard" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Copy URL to Clipboard
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
        </div>
      </div>
    </FormArea>
  )
}

function GoogleMyBusinessAccount() {
  const { state, setState } = useDashboard()
  return (
    <div className="flex flex-col gap-2">
      <div>
        <Image src={`/images/logos/google.svg`} width={28} height={28} alt={'google logo'} className='py-2' />
        <h2 className='font-semibold text-base md:text-lg tracking-tight text-slate-800 leading-tight'>
          Google My Business
        </h2>
        <p className='text-sm font-semibold italic text-slate-500 '>
          Help customers leave reviews on Google
        </p>
      </div>
      <div>
        <Label htmlFor="review-link-input">Review Link</Label>
        <Input className="w-96 max-w-full"
          id="review-link-input"
          placeholder="https://g.page/r/CTAANO9cfKlBEAE/review"
          value={state.googleLink}
          onChange={e => setState({
            googleLink: e.target.value
          })}
        />
      </div>
    </div>
  )
}

function InstagramAccount() {
  const { state, setState } = useDashboard()
  return (
    <div className="flex flex-col gap-2">
      <div>
        <Image src={`/images/logos/instagram.svg`} width={28} height={28} alt={'instagram logo'} className='py-2' />
        <h2 className='font-semibold text-base md:text-lg tracking-tight text-slate-800 leading-tight'>
          Instagram
        </h2>
        <p className='text-sm font-semibold italic text-slate-500 '>
          Connect your Instagram Account
        </p>
      </div>
      <div>
        <Label htmlFor="instagram-handle-input">Instagram Handle</Label>
        <LabelledInput
          value={state.instagramHandle}
          onChange={e => setState({
            instagramHandle: e.target.value
          })}
          label="@" className="w-96 max-w-full" id="instagram-handle-input" placeholder="handle"
        />
      </div>
    </div>
  )
}

function TikTokAccount() {
  const { state, setState } = useDashboard()
  return (
    <div className="flex flex-col gap-2">
      <div>
        <Image src={`/images/logos/tiktok.svg`} width={28} height={28} alt={'instagram logo'} className='py-2' />
        <h2 className='font-semibold text-base md:text-lg tracking-tight text-slate-800 leading-tight'>
          TikTok
        </h2>
        <p className='text-sm font-semibold italic text-slate-500 '>
          Connect your TikTok Account
        </p>
      </div>
      <div>
        <Label htmlFor="tiktok-handle-input">TikTok Handle</Label>
        <LabelledInput
          value={state.tikTokHandle}
          onChange={e => setState({
            tikTokHandle: e.target.value
          })}
          label="@" className="w-96 max-w-full" id="tiktok-handle-input" placeholder="handle" />
      </div>
    </div>
  )
}

function FacebookAccount() {
  const { state, setState } = useDashboard()
  return (
    <div className="flex flex-col gap-2">
      <div>
        <Image src={`/images/logos/facebook.svg`} width={28} height={28} alt={'instagram logo'} className='py-2' />
        <h2 className='font-semibold text-base md:text-lg tracking-tight text-slate-800 leading-tight'>
          Facebook
        </h2>
        <p className='text-sm font-semibold italic text-slate-500 '>
          Connect your Facebook Account
        </p>
      </div>
      <div>
        <Label htmlFor="facebook-username-input">Facebook Username</Label>
        <LabelledInput
          value={state.facebookUsername}
          onChange={e => setState({
            facebookUsername: e.target.value
          })}
          label="fb.com/" className="w-96 max-w-full" id="facebook-username-input" placeholder="handle" />
      </div>
    </div>
  )
}