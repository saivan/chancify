import { ReactNode } from 'react'

export function CenterBox ({ 
  children,
  title,
  caption,
}: { children: ReactNode, title: string, caption: string }) {
    return <div className="w-full max-w-[1024px] mx-auto py-16 px-4 md:px-8">
      <div className='py-6'>
        <h1 className='font-semibold text-3xl md:text-5xl tracking-tighter text-slate-800 leading-tight'
        >{title}</h1>
        <p  className='text-lg md:text-xl font-semibold italic text-slate-500 '>{caption}</p>
      </div>
      <div> {children} </div>
    </div>
}