import { Button } from '@repo/components'
import { camelToTitle } from '@repo/utilities'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'


export function CenterBox({
  children,
  title,
  caption,
  icon,
  back,
}: { children: ReactNode, title: string, caption: string, icon?: string, back?: string }) {
  const backPageName = back != null && camelToTitle(back?.split('/').pop() || '')
  return <div className="w-full max-w-[1024px] mx-auto py-16 px-4 md:px-8">
    {
      back &&
      <div className='mb-6'>
      <Link href={back}>
        <Button variant='outline'>
          Back to {backPageName}
        </Button>
      </Link>
      </div>
    }
    <div className='py-6'>
      {
        icon && <Image src={`/images/logos/${icon}.svg`} width={56} height={56} alt={icon} className='py-2' />
      }
      <h1 className='font-semibold text-2xl md:text-4xl tracking-tight text-slate-800 leading-tight'
      >{title}</h1>
      <p className='text-base md:text-lg font-semibold italic text-slate-500 '>{caption}</p>
    </div>
    <div> {children} </div>
  </div>
}
