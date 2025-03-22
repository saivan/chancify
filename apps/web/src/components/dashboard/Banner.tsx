
import Image from "next/image"
import { cn } from "@repo/utilities"

export function Banner(props: { src: string }) {
  return (
    <div className="relative w-full h-96 -z-10 -mb-12">
      <Image
        className="h-96 w-full fill object-cover "
        style={{ objectFit: 'cover' }}
        priority
        fill
        src={props.src} 
        alt="Lock"
      />
      <div className={cn(
        "absolute bottom-0 w-full", 
        "bg-linear-to-t from-white via-white/80 to-white/0 h-[70%]"
      )}></div>
    </div>
  )
}