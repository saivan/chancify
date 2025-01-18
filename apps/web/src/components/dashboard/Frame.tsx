import { Banner } from "./Banner"
import { cn } from "@repo/utilities"


export async function Frame(props: {
  bannerSrc: string
  heading: string
  subheading: string
  description: string
  children: React.ReactNode
}) {
  return (
    <main >
      <Banner src={props.bannerSrc}/>
      <div className="max-w-256 mx-auto p-8" >
        <div className="flex flex-col gap-6">
          <div >
            <h1 className={cn(
              "font-semibold text-3xl tracking-tighter text-slate-800 leading-tight",
              "md:text-5xl"
            )}>
            { props.heading }
            </h1>
            <span className={cn(
              "text-md font-semibold italic text-slate-500",
              "md:text-xl"
            )}>
            { props.subheading }
            </span>
          </div>
          <div>
            <p className="text-sm md:text-xl text-slate-600" > {props.description} </p>
          </div>
        </div>
        { props.children }
      </div>
    </main>
  )
}