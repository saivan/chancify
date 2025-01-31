import { CenterBox } from "@/components/dashboard/CenterBox";
import { Card, CardContent, CardHeader, Input, Label } from "@repo/components";
import Image from "next/image";

export default function () {
  return (
    <div>
      <CenterBox
        title='Accounts'
        caption='Link your accounts to help customers find you'
      >
        <div className="flex flex-col gap-4" >
          <GoogleMyBusinessAccount />
          <InstagramAccount />
          <TikTokAccount />
        </div>
      </CenterBox>
    </div>
  )
}

function GoogleMyBusinessAccount () {
  return (
    <Card>
      <CardHeader>
        <Image src={`/images/logos/google.svg`} width={32} height={32} alt={'google logo'} className='py-2' />
        <h2 className='font-semibold text-2xl md:text-4xl tracking-tight text-slate-800 leading-tight'>
          Google My Business
        </h2>
        <p className='text-base md:text-lg font-semibold italic text-slate-500 '>
          Connect your Google My Business account
        </p>
      </CardHeader>
      <CardContent>
        <Label htmlFor="review-link-input">Review Link</Label>
        <Input className="w-96 max-w-full" id="review-link-input" placeholder="https://g.page/r/CTAANO9cfKlBEAE/review" />
      </CardContent>
    </Card>
  )
}

function InstagramAccount () {
  return (
    <Card>
      <CardHeader>
        <Image src={`/images/logos/instagram.svg`} width={32} height={32} alt={'instagram logo'} className='py-2' />
        <h2 className='font-semibold text-2xl md:text-4xl tracking-tight text-slate-800 leading-tight'>
          Instagram
        </h2>
        <p className='text-base md:text-lg font-semibold italic text-slate-500 '>
          Connect your Instagram Account
        </p>
      </CardHeader>
      <CardContent>
        <Label htmlFor="instagram-handle-input">Instagram Handle</Label>
        <Input className="w-96 max-w-full" id="instagram-handle-input" placeholder="@handle" />
      </CardContent>
    </Card>
  )
}

function TikTokAccount () {
  return (
    <Card>
      <CardHeader>
        <Image src={`/images/logos/tiktok.svg`} width={32} height={32} alt={'instagram logo'} className='py-2' />
        <h2 className='font-semibold text-2xl md:text-4xl tracking-tight text-slate-800 leading-tight'>
          TikTok
        </h2>
        <p className='text-base md:text-lg font-semibold italic text-slate-500 '>
          Connect your TikTok Account
        </p>
      </CardHeader>
      <CardContent>
        <Label htmlFor="instagram-handle-input">TikTok Handle</Label>
        <Input className="w-96 max-w-full" id="instagram-handle-input" placeholder="@handle" />
      </CardContent>
    </Card>
  )
}