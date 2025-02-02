'use client'

import { CenterBox } from "@/components/dashboard/CenterBox";
import { Card, CardContent, CardHeader, cn, Input, Label, LabelledInput, LoadingButton } from "@repo/components";
import Image from "next/image";
import { useState } from 'react'

export default function () {
  return (
    <div>
      <CenterBox
        title='Organization Settings'
        caption='Change settings to administrate your organization'
      >
        <div className="flex flex-col gap-8 py-8" >
          <UrlUpdater />
          <SocialAccounts />
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

function UrlUpdater() {
  const [loading, setLoading] = useState(false)
  return (
    <FormArea
      title="Live Url"
      caption="Customers will access your campaigns at chancify.org"
    >
      <Label htmlFor="url-input">Handle</Label>
      <div className="flex gap-2 flex-wrap">
        <LabelledInput label="chancify.org/live/" className="w-96 max-w-full" id="url-input" placeholder="handle" />
        <LoadingButton variant="destructive" loading={loading} size='sm'
          className="min-w-max"
          onClick={async () => {
            setLoading(true)
            await new Promise(resolve => setTimeout(resolve, 2000))
            setLoading(false)
          }}
        >Change Handle</LoadingButton>
      </div>
      <span className="text-xs text-slate-500">Changing this breaks existing links and QR codes</span>
    </FormArea>
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
      </div>
    </FormArea>
  )
}

function GoogleMyBusinessAccount() {
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
        <Input className="w-96 max-w-full" id="review-link-input" placeholder="https://g.page/r/CTAANO9cfKlBEAE/review" />
      </div>
    </div>
  )
}

function InstagramAccount() {
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
        <LabelledInput label="@" className="w-96 max-w-full" id="instagram-handle-input" placeholder="handle" />
      </div>
    </div>
  )
}

function TikTokAccount() {
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
        <Label htmlFor="instagram-handle-input">TikTok Handle</Label>
        <LabelledInput label="@" className="w-96 max-w-full" id="instagram-handle-input" placeholder="handle" />
      </div>
    </div>
  )
}